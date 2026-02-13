import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { portfolioData } from '@/lib/data';

export async function GET() {
  try {
    const batch = writeBatch(db);

    // Seed Hero
    const heroRef = doc(db, 'content', 'hero');
    batch.set(heroRef, portfolioData.hero);

    // Seed About
    const aboutRef = doc(db, 'content', 'about');
    batch.set(aboutRef, portfolioData.about);

    // Seed Expertise
    const expertiseRef = doc(db, 'content', 'expertise');
    batch.set(expertiseRef, portfolioData.expertise);

    // Seed Skills
    const skillsRef = doc(db, 'content', 'skills');
    batch.set(skillsRef, portfolioData.skills);

    // Seed Contact
    const contactRef = doc(db, 'content', 'contact');
    batch.set(contactRef, portfolioData.contact);

    // Seed Personal Info (Name, Role)
    const personalRef = doc(db, 'content', 'personal');
    batch.set(personalRef, { name: portfolioData.name, role: portfolioData.role });

    // Seed Projects (Separate Collection)
    // Note: This appends projects. To clear, we'd need to delete first.
    // For now we assume fresh or just appending is fine for dev.
    // Realistically we should probably check if they exist or use fixed IDs.
    const projectsCol = collection(db, 'projects');
    (portfolioData.projects || []).forEach((p: any) => {
      // Use p.id as doc ID if available for idempotency
      const docRef = p.id ? doc(projectsCol, p.id) : doc(projectsCol);
      batch.set(docRef, {
        ...p,
        createdAt: serverTimestamp(),
      });
    });

    await batch.commit();

    return NextResponse.json({ ok: true, seeded: 'Full portfolio data seeded' });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
