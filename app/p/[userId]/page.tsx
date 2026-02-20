"use client";

import { usePortfolio } from "@/hooks/usePortfolio";
import { useAnalytics } from "@/hooks/useAnalytics";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { NotFoundScreen } from "@/components/ui/NotFoundScreen";
import { useParams } from "next/navigation";
import { PortfolioContent } from "@/components/portfolio/portfolio-content";

export default function UserPortfolio() {
    const params = useParams();
    // Safely extract userId, assuming the dynamic route is [userId]
    const userId = params?.userId as string | undefined;

    // Use empty string fallback if needed, but hook handles undefined
    const { data, loading, notFound, resolvedUid, isResolving, fetchFromRoot } = usePortfolio(userId);
    useAnalytics(resolvedUid, isResolving, notFound, fetchFromRoot);

    if (loading) return <LoadingScreen />;
    if (notFound) return <NotFoundScreen />;

    // Use resolved UID if available (for username URLs), otherwise fallback to param userId
    const effectiveUserId = resolvedUid || userId;

    return <PortfolioContent data={data} userId={effectiveUserId} />;
}
