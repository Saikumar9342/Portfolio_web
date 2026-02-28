import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';

const PLAN_META: Record<string, { amountInr: number; planName: string }> = {
  monthly: { amountInr: 100, planName: 'premium_monthly' },
  yearly: { amountInr: 500, planName: 'premium_yearly' },
};

const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_MAX_ATTEMPTS = 8;

type VerifyBody = {
  paymentId?: string;
  planType?: string;
};

type VerificationRecord = {
  uid?: string;
  planType?: string;
  paymentId?: string;
};

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) return null;
  return authHeader.slice(7).trim();
}

function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for') || '';
  if (xff.includes(',')) return xff.split(',')[0].trim();
  if (xff.trim()) return xff.trim();
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  d.setMonth(d.getMonth() + months);
  return d;
}

async function enforceRateLimit(uid: string, ip: string) {
  if (!db || !admin?.apps?.length) return;

  const bucket = Math.floor(Date.now() / RATE_WINDOW_MS);
  const key = `billing_verify_${uid}_${bucket}`;
  const ref = db.collection('security_rate_limits').doc(key);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = Number(snap.data()?.count || 0);

    if (current >= RATE_MAX_ATTEMPTS) {
      throw new Error('RATE_LIMITED');
    }

    tx.set(
      ref,
      {
        uid,
        ip,
        count: current + 1,
        bucket,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: snap.exists
          ? (snap.data()?.createdAt ?? admin.firestore.FieldValue.serverTimestamp())
          : admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });
}

export async function POST(req: Request) {
  try {
    if (!admin?.apps?.length || !db) {
      return NextResponse.json(
        { success: false, error: 'Billing verification backend is not configured.' },
        { status: 500 }
      );
    }

    const token = getBearerToken(req);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing auth token.' },
        { status: 401 }
      );
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    const clientIp = getClientIp(req);
    await enforceRateLimit(uid, clientIp);

    const body = (await req.json()) as VerifyBody;
    const paymentId = (body.paymentId || '').trim();
    const planType = (body.planType || '').trim().toLowerCase();

    if (!paymentId || !paymentId.startsWith('pay_') || !PLAN_META[planType]) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment verification payload.' },
        { status: 400 }
      );
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || '';
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';
    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json(
        { success: false, error: 'Server Razorpay credentials are missing.' },
        { status: 500 }
      );
    }

    const verificationRef = db.collection('payment_verifications').doc(paymentId);
    const existingVerificationSnap = await verificationRef.get();
    if (existingVerificationSnap.exists) {
      const existing = existingVerificationSnap.data() as VerificationRecord;
      if (existing.uid !== uid || existing.planType !== planType) {
        return NextResponse.json(
          { success: false, error: 'This payment is already linked to another subscription.' },
          { status: 409 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Membership already verified for this payment.',
      });
    }

    const basicAuth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');

    const verifyResp = await fetch(
      `https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!verifyResp.ok) {
      return NextResponse.json(
        { success: false, error: 'Unable to verify payment with Razorpay.' },
        { status: 400 }
      );
    }

    const razorpayPayment = (await verifyResp.json()) as {
      id?: string;
      amount?: number;
      currency?: string;
      status?: string;
      captured?: boolean;
      method?: string;
      email?: string;
      contact?: string;
      created_at?: number;
      notes?: Record<string, string | undefined>;
    };

    const { amountInr, planName } = PLAN_META[planType];
    const expectedPaisa = amountInr * 100;
    const status = (razorpayPayment.status || '').toLowerCase();

    const notesUserUid = (razorpayPayment.notes?.user_uid || '').trim();
    const notesPlanType = (razorpayPayment.notes?.plan_type || '').trim().toLowerCase();

    const isStatusValid = status === 'captured' && razorpayPayment.captured === true;
    const isAmountValid = Number(razorpayPayment.amount || 0) === expectedPaisa;
    const isCurrencyValid = (razorpayPayment.currency || '').toUpperCase() === 'INR';
    const isPaymentIdValid = (razorpayPayment.id || '') === paymentId;
    const isOwnershipValid = notesUserUid === uid && notesPlanType === planType;

    if (!isStatusValid || !isAmountValid || !isCurrencyValid || !isPaymentIdValid) {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed due to amount/status mismatch.' },
        { status: 400 }
      );
    }

    if (!isOwnershipValid) {
      return NextResponse.json(
        { success: false, error: 'Payment ownership validation failed.' },
        { status: 403 }
      );
    }

    const now = new Date();
    const expiresAt = planType === 'yearly' ? addMonths(now, 12) : addMonths(now, 1);

    const billingRef = db.collection('users').doc(uid).collection('billing').doc('subscription');
    const txRef = billingRef.collection('transactions').doc(paymentId);
    const publicUserRef = db.collection('users').doc(uid);

    await db.runTransaction(async (tx) => {
      const lock = await tx.get(verificationRef);
      if (lock.exists) {
        const existing = lock.data() as VerificationRecord;
        if (existing.uid !== uid || existing.planType !== planType) {
          throw new Error('PAYMENT_ALREADY_USED');
        }
        return;
      }

      tx.create(verificationRef, {
        paymentId,
        uid,
        planType,
        provider: 'razorpay',
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      tx.set(
        billingRef,
        {
          plan: 'premium',
          planType,
          planName,
          status: 'active',
          isPremium: true,
          provider: 'razorpay',
          paymentId,
          amountInr,
          currency: 'INR',
          verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          periodStart: now,
          periodEnd: expiresAt,
        },
        { merge: true }
      );

      tx.set(
        txRef,
        {
          paymentId,
          planType,
          planName,
          amountInr,
          amountPaisa: expectedPaisa,
          provider: 'razorpay',
          razorpayStatus: status,
          razorpayCaptured: razorpayPayment.captured === true,
          method: razorpayPayment.method || '',
          email: razorpayPayment.email || '',
          contact: razorpayPayment.contact || '',
          razorpayCreatedAt: razorpayPayment.created_at || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      // Public premium marker for website rendering.
      tx.set(
        publicUserRef,
        {
          isPremium: true,
          plan: 'premium',
          status: 'active',
          membershipUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    });

    return NextResponse.json({
      success: true,
      message: 'Membership activated successfully.',
      membership: {
        plan: 'premium',
        status: 'active',
        planType,
        periodEnd: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'PAYMENT_ALREADY_USED') {
      return NextResponse.json(
        { success: false, error: 'This payment has already been used.' },
        { status: 409 }
      );
    }

    if (error instanceof Error && error.message === 'RATE_LIMITED') {
      return NextResponse.json(
        { success: false, error: 'Too many verification attempts. Try again in a few minutes.' },
        { status: 429 }
      );
    }

    console.error('Billing verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal verification error.' },
      { status: 500 }
    );
  }
}
