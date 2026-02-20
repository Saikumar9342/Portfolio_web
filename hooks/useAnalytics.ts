"use client";

import { useEffect } from "react";
import { doc, increment, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useAnalytics(
    resolvedUid: string | undefined,
    isResolving: boolean,
    isNotFound: boolean,
    fetchFromRoot: boolean
) {
    useEffect(() => {
        if (isResolving || isNotFound) return;

        // Use session storage to prevent count spamming in a single session
        const sessionKey = `v_count_${resolvedUid || 'global'}`;
        if (sessionStorage.getItem(sessionKey)) return;

        async function incrementVisits() {
            try {
                if (resolvedUid) {
                    // Update user-specific visits
                    const userRef = doc(db, "users", resolvedUid);
                    await setDoc(userRef, { totalVisits: increment(1) }, { merge: true });
                    // Update global analytics for the admin to see total traffic
                    const globalRef = doc(db, "analytics", "global");
                    await setDoc(globalRef, { totalVisits: increment(1) }, { merge: true });

                } else if (fetchFromRoot) {
                    // Update main site global visits
                    const globalRef = doc(db, "analytics", "global");
                    await setDoc(globalRef, { totalVisits: increment(1) }, { merge: true });
                }

                sessionStorage.setItem(sessionKey, 'true');
            } catch (error) {
                console.error("Error incrementing visits:", error);
            }
        }

        incrementVisits();
    }, [resolvedUid, isResolving, isNotFound, fetchFromRoot]);
}
