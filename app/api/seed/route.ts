import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { portfolioData } from '@/lib/data';

export async function GET() {
  try {
    const col = collection(db, 'projects');
    const promises = (portfolioData.projects || []).map((p: any) =>
      addDoc(col, {
        title: p.title,
        description: p.description,
        techStack: p.techStack || [],
        imageUrl: p.imageUrl || '',
        liveLink: p.liveLink || '',
        githubLink: p.githubLink || '',
        createdAt: serverTimestamp(),
      })
    );
    await Promise.all(promises);
    return NextResponse.json({ ok: true, seeded: portfolioData.projects.length });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
