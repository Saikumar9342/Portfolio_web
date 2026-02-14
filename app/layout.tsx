import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
})

export const metadata: Metadata = {
    title: {
        template: '%s | ATOM',
        default: 'ATOM | Portfolio Builder',
    },
    description: 'ATOM Portfolio Builder - Scalable web and mobile applications.',
    icons: {
        icon: '/favicon.svg',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://saikumar.dev',
        siteName: 'ATOM Portfolio',
    }
}

import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import dynamic from 'next/dynamic';
const ScrollToTop = dynamic(() => import('@/components/ui/ScrollToTop').then((m) => m.ScrollToTop), { ssr: false });
import { ToastProvider } from '@/components/ui/Toast';
import { ThemeProvider } from '@/hooks/useTheme';
import { PageTransition } from '@/components/ui/PageTransition';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
            <body className="font-sans" suppressHydrationWarning>
                <div className="noise" />
                <ThemeProvider>
                    <ToastProvider>
                        <CustomCursor />
                        <ScrollProgress />
                        <ScrollToTop />
                        <PageTransition>
                            {children}
                        </PageTransition>
                    </ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
