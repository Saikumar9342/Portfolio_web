import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebaseAdmin";

type UsernamePageProps = {
    params: {
        username: string;
    };
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function UsernamePortfolioPage({ params }: UsernamePageProps) {
    const normalizedUsername = decodeURIComponent(params.username || "")
        .trim()
        .toLowerCase();

    if (!normalizedUsername) {
        redirect("/");
    }

    try {
        const db = getAdminDb();
        const usernameDoc = await db.collection("usernames").doc(normalizedUsername).get();
        const userId = usernameDoc.data()?.userId as string | undefined;

        if (!userId) {
            redirect("/");
        }

        redirect(`/p/${userId}`);
    } catch (_error) {
        redirect("/");
    }
}
