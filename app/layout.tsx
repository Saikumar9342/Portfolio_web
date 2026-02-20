import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import dynamic from 'next/dynamic';
const ScrollToTop = dynamic(() => import('@/components/ui/ScrollToTop').then((m) => m.ScrollToTop), { ssr: false });
import { ToastProvider } from '@/components/ui/Toast';
import { ThemeProvider } from '@/hooks/useTheme';
import { PageTransition } from '@/components/ui/PageTransition';
import { LanguageProvider } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

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
    metadataBase: new URL('https://atom.anithix.com'),
    title: {
        template: '%s | ATOM',
        default: 'ATOM | Portfolio Builder',
    },
    description: 'ATOM Portfolio Builder - Scalable web and mobile applications for professionals.',
    manifest: '/site.webmanifest',
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    openGraph: {
        title: 'ATOM | Portfolio Builder',
        description: 'Design and deploy professional, scalable web and mobile portfolios with ATOM.',
        type: 'website',
        locale: 'en_US',
        url: 'https://atom.anithix.com',
        siteName: 'ATOM Portfolio',
        images: [
            {
                url: '/og-image.jpg', // Recommend creating an og-image.jpg in public folder
                width: 1200,
                height: 630,
                alt: 'ATOM Portfolio Preview',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ATOM | Portfolio Builder',
        description: 'Design and deploy professional, scalable web and mobile portfolios with ATOM.',
        images: ['/og-image.jpg'],
    },
}

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
                    <LanguageProvider>
                        <ToastProvider>
                            <CustomCursor />
                            <ScrollProgress />
                            <ScrollToTop />
                            <LanguageSwitcher />
                            <PageTransition>
                                {children}
                            </PageTransition>
                        </ToastProvider>
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
