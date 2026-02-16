"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, onSnapshot, query, where, doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { Language } from "@/types";

interface LanguageContextType {
    currentLanguage: Language;
    languages: Language[];
    setLanguage: (lang: Language) => void;
    loading: boolean;
}

const defaultLanguage: Language = {
    code: "en",
    name: "English",
    isDefault: true,
    flag: "🇺🇸"
};

const LanguageContext = createContext<LanguageContextType>({
    currentLanguage: defaultLanguage,
    languages: [defaultLanguage],
    setLanguage: () => { },
    loading: true
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [currentLanguage, setCurrentLanguage] = useState<Language>(defaultLanguage);
    const [languages, setLanguages] = useState<Language[]>([defaultLanguage]);
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const adminUidsString = process.env.NEXT_PUBLIC_ADMIN_UIDS || "";
    const adminUids = adminUidsString.split(",").map(id => id.trim()).filter(id => id.length > 0);

    // Fetch available languages from Firestore
    useEffect(() => {
        let isCancelled = false;
        let unsubscribe = () => { };

        async function init() {
            let targetUid: string | undefined = undefined;

            // 1. Identify if we are on a user's portfolio
            const userId = params?.userId as string | undefined;
            const username = params?.username as string | undefined;
            const routeId = userId || username;

            if (routeId && routeId !== "index") {
                // If it's an admin, we might want their specific languages or global ones
                // For now, if it's a specific routeId, let's resolve it.
                if (adminUids.includes(routeId)) {
                    // Admin uses global languages or treated as root
                    targetUid = undefined;
                } else {
                    try {
                        // Try as UID
                        const dRef = doc(db, "users", routeId);
                        const dSnap = await getDoc(dRef);
                        if (dSnap.exists()) {
                            targetUid = routeId;
                        } else {
                            // Try as username
                            const uRef = doc(db, "usernames", routeId);
                            const uSnap = await getDoc(uRef);
                            if (uSnap.exists()) {
                                targetUid = uSnap.data()?.userId;
                            }
                        }
                    } catch (e) {
                        console.error("Error resolving user for languages:", e);
                    }
                }
            }

            if (isCancelled) return;

            // 2. Setup Listener
            const languagesRef = targetUid
                ? collection(db, "users", targetUid, "languages")
                : collection(db, "languages");

            unsubscribe = onSnapshot(languagesRef, (snapshot) => {
                const langs: Language[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    langs.push({
                        code: doc.id,
                        name: data.name || doc.id,
                        flag: data.flag,
                        isDefault: data.isDefault || doc.id === 'en'
                    });
                });

                // Ensure English is present
                if (!langs.find(l => l.code === 'en')) {
                    langs.push(defaultLanguage);
                }

                langs.sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : a.name.localeCompare(b.name)));
                setLanguages(langs);
                setLoading(false);
            }, (error) => {
                console.error("Error fetching languages:", error);
                setLanguages([defaultLanguage]);
                setLoading(false);
            });
        }

        init();

        return () => {
            isCancelled = true;
            unsubscribe();
        };
    }, [params?.userId, params?.username]);

    const setLanguage = (lang: Language) => {
        setCurrentLanguage(lang);
        try {
            localStorage.setItem("portfolio_language", lang.code);
            window.location.reload();
        } catch (e) { }
    };

    // Load saved preference on mount
    useEffect(() => {
        const saved = localStorage.getItem("portfolio_language");
        if (saved && languages.some(l => l.code === saved)) {
            const savedLang = languages.find(l => l.code === saved);
            if (savedLang) setCurrentLanguage(savedLang);
        }
    }, [languages]);

    return (
        <LanguageContext.Provider value={{ currentLanguage, languages, setLanguage, loading }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
