"use client";

import { useParams } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { NotFoundScreen } from "@/components/ui/NotFoundScreen";
import { PortfolioContent } from "@/app/p/[userId]/page";

export default function UsernamePortfolioPage() {
    const params = useParams();
    const username = params?.username as string | undefined;
    const { data, loading, notFound, resolvedUid } = usePortfolio(username);

    if (loading) return <LoadingScreen />;
    if (notFound) return <NotFoundScreen />;

    return <PortfolioContent data={data} userId={resolvedUid || username} />;
}
