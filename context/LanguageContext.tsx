"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
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

    // Fetch available languages from Firestore
    useEffect(() => {
        // Assuming languages are stored at the root 'languages' collection or under a user
        // Ideally under the specific user if multi-tenant, or global if single-tenant.
        // Based on the user's request "add languages in mobile", it's likely user-specific.
        // However, usePortfolio uses userId, so we need to know where to fetch languages from.
        // For simplicity, let's fetch from a top-level 'languages' collection if generic, 
        // OR fetch from the user's subcollection if we had the userId here.

        // Since this provider wraps the app, we might not have userId yet if it's passed as prop to components.
        // But typically the portfolio is for ONE user (the portfolio owner).
        // Let's assume a 'languages' collection exists at the root for now, or fetch from 'settings'.

        // Strategy: Fetch from "languages" collection. If empty, default to English.
        const languagesRef = collection(db, "languages");

        const unsubscribe = onSnapshot(languagesRef, (snapshot) => {
            const langs: Language[] = [];

            // Always ensure default English is in the list
            const hasEnglish = snapshot.docs.some(doc => doc.id === 'en');
            if (!hasEnglish) {
                langs.push(defaultLanguage);
            }

            snapshot.forEach((doc) => {
                const data = doc.data();
                langs.push({
                    code: doc.id,
                    name: data.name || doc.id,
                    flag: data.flag,
                    isDefault: data.isDefault || doc.id === 'en'
                });
            });

            // Remove duplicate if we added it manually but it also exists in Firestore (shouldn't happen with hasEnglish check)

            // Sort: Default first, then alphabetical
            langs.sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : a.name.localeCompare(b.name)));

            setLanguages(langs);

            // If current language is not in the list (e.g. init), set to default
            if (!langs.find(l => l.code === currentLanguage.code)) {
                const defaultLang = langs.find(l => l.isDefault) || langs[0];
                setCurrentLanguage(defaultLang);
            }

            setLoading(false);
        }, (error) => {
            console.error("Error fetching languages:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const setLanguage = (lang: Language) => {
        setCurrentLanguage(lang);
        // Persist preference
        try {
            localStorage.setItem("portfolio_language", lang.code);
            // Hard reload as requested to ensure clean re-initialization of all data hooks
            window.location.reload();
        } catch (e) {
            // ignore
        }
    };

    // Load saved preference on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem("portfolio_language");
            if (saved && languages.some(l => l.code === saved)) {
                const savedLang = languages.find(l => l.code === saved);
                if (savedLang) setCurrentLanguage(savedLang);
            }
        } catch (e) {
            // ignore
        }
    }, [languages]);

    return (
        <LanguageContext.Provider value={{ currentLanguage, languages, setLanguage, loading }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
