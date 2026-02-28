import { createHmac, timingSafeEqual } from 'crypto';

import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';

const PLAN_META: Record<string, { amountInr: number; planName: string }> = {
  monthly: { amountInr: 100, planName: 'premium_monthly' },
  yearly: { amountInr: 500, planName: 'premium_yearly' },
};

type RazorpayWebhookPayload = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
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
    };
  };
};

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  d.setMonth(d.getMonth() + months);
  return d;
}

function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8');
  const bBuf = Buffer.from(b, 'utf8');
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(req: Request) {
  try {
    if (!admin?.apps?.length || !db) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    if (!secret) {
      return NextResponse.json({ ok: false, error: 'Webhook secret missing.' }, { status: 500 });
    }

    const signature = req.headers.get('x-razorpay-signature') || '';
    if (!signature) {
      return NextResponse.json({ ok: false, error: 'Missing webhook signature.' }, { status: 401 });
    }

    const rawBody = await req.text();
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    if (!safeCompare(signature, expected)) {
      return NextResponse.json({ ok: false, error: 'Invalid webhook signature.' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
    if (payload.event !== 'payment.captured') {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const payment = payload.payload?.payment?.entity;
    const paymentId = (payment?.id || '').trim();
    const status = (payment?.status || '').trim().toLowerCase();
    const captured = payment?.captured === true;
    const currency = (payment?.currency || '').trim().toUpperCase();

    const uid = (payment?.notes?.user_uid || '').trim();
    const planType = (payment?.notes?.plan_type || '').trim().toLowerCase();
    const planMeta = PLAN_META[planType];

    if (!paymentId || !uid || !planMeta) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const expectedPaisa = planMeta.amountInr * 100;
    const amount = Number(payment?.amount || 0);

    const isValid =
      status === 'captured' &&
      captured &&
      currency === 'INR' &&
      amount === expectedPaisa;

    if (!isValid) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const verificationRef = db.collection('payment_verifications').doc(paymentId);
    const billingRef = db.collection('users').doc(uid).collection('billing').doc('subscription');
    const txRef = billingRef.collection('transactions').doc(paymentId);
    const publicUserRef = db.collection('users').doc(uid);

    const now = new Date();
    const expiresAt = planType === 'yearly' ? addMonths(now, 12) : addMonths(now, 1);

    await db.runTransaction(async (tx) => {
      const lock = await tx.get(verificationRef);
      if (lock.exists) return;

      tx.create(verificationRef, {
        paymentId,
        uid,
        planType,
        provider: 'razorpay',
        source: 'webhook',
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      tx.set(
        billingRef,
        {
          plan: 'premium',
          planType,
          planName: planMeta.planName,
          status: 'active',
          isPremium: true,
          provider: 'razorpay',
          paymentId,
          amountInr: planMeta.amountInr,
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
          planName: planMeta.planName,
          amountInr: planMeta.amountInr,
          amountPaisa: expectedPaisa,
          provider: 'razorpay',
          razorpayStatus: status,
          razorpayCaptured: captured,
          method: payment?.method || '',
          email: payment?.email || '',
          contact: payment?.contact || '',
          razorpayCreatedAt: payment?.created_at || null,
          source: 'webhook',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

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

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
