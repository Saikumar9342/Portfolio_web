import { Metadata } from 'next';
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
    try {
        const usernameRef = doc(db, "usernames", params.username);
        const usernameSnap = await getDoc(usernameRef);

        if (!usernameSnap.exists()) return { title: 'User Not Found' };

        const userId = usernameSnap.data().userId;
        const seoRef = doc(db, "users", userId, "content", "seo");
        const profileRef = doc(db, "users", userId);

        const [seoSnap, profileSnap] = await Promise.all([
            getDoc(seoRef),
            getDoc(profileRef)
        ]);

        let title = "Portfolio";
        let description = "A professional portfolio.";
        let ogImage = "";

        if (profileSnap.exists()) {
            const profileData = profileSnap.data();
            title = `${profileData.displayName || profileData.username || "User"} | Portfolio`;
        }

        if (seoSnap.exists()) {
            const data = seoSnap.data();
            if (data.seoTitle) title = data.seoTitle;
            if (data.seoDescription) description = data.seoDescription;
            if (data.ogImage) ogImage = data.ogImage;
        }

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                ...(ogImage && { images: [{ url: ogImage }] }),
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                ...(ogImage && { images: [ogImage] }),
            }
        };
    } catch (e) {
        return { title: 'User Portfolio' };
    }
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
