import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { portfolioData } from '@/lib/data';

export async function GET(request: Request) {
  const expectedSecret = process.env.SEED_SECRET;
  const url = new URL(request.url);
  const providedSecret =
    request.headers.get('x-seed-secret') || url.searchParams.get('secret');

  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const adminDb = getAdminDb();
    const batch = adminDb.batch();

    // Seed Hero
    const heroRef = adminDb.collection('content').doc('hero');
    batch.set(heroRef, portfolioData.hero);

    // Seed About
    const aboutRef = adminDb.collection('content').doc('about');
    batch.set(aboutRef, portfolioData.about);

    // Seed Expertise
    const expertiseRef = adminDb.collection('content').doc('expertise');
    batch.set(expertiseRef, portfolioData.expertise);

    // Seed Skills
    const skillsRef = adminDb.collection('content').doc('skills');
    batch.set(skillsRef, portfolioData.skills);

    // Seed Contact
    const contactRef = adminDb.collection('content').doc('contact');
    batch.set(contactRef, portfolioData.contact);

    // Seed Personal Info (Name, Role)
    const personalRef = adminDb.collection('content').doc('personal');
    batch.set(personalRef, { name: portfolioData.name, role: portfolioData.role });

    // Seed Projects (Separate Collection)
    // Note: This appends projects. To clear, we'd need to delete first.
    // For now we assume fresh or just appending is fine for dev.
    // Realistically we should probably check if they exist or use fixed IDs.
    const projectsCol = adminDb.collection('projects');
    (portfolioData.projects || []).forEach((p: any) => {
      // Use p.id as doc ID if available for idempotency
      const docRef = p.id ? projectsCol.doc(p.id) : projectsCol.doc();
      batch.set(docRef, {
        ...p,
        createdAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    return NextResponse.json({ ok: true, seeded: 'Full portfolio data seeded' });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
