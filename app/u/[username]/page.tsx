"use client";

import { useParams } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useAnalytics } from "@/hooks/useAnalytics";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { NotFoundScreen } from "@/components/ui/NotFoundScreen";
import { PortfolioContent } from "@/components/portfolio/portfolio-content";

export default function UsernamePortfolioPage() {
    const params = useParams();
    const username = params?.username as string | undefined;
    const { data, loading, notFound, resolvedUid, isResolving, fetchFromRoot } = usePortfolio(username);
    useAnalytics(resolvedUid, isResolving, notFound, fetchFromRoot);

    if (loading) return <LoadingScreen />;
    if (notFound) return <NotFoundScreen />;

    return <PortfolioContent data={data} userId={resolvedUid || username} />;
}
