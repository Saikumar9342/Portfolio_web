import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

export const metadata: Metadata = {
    title: {
        template: '%s | Portfolio',
        default: 'Saikumar | Software Engineer', // Default title
    },
    description: 'Portfolio of Saikumar, an Associate Software Engineer specializing in scalable web and mobile applications.',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://saikumar.dev', // Replace with actual domain if known, or generic placeholder
        siteName: 'Saikumar Porfolio',
    }
}

import { CustomCursor } from "@/components/ui/CustomCursor";
import dynamic from 'next/dynamic';
const ScrollToTop = dynamic(() => import('@/components/ui/ScrollToTop').then((m) => m.ScrollToTop), { ssr: false });
import { ToastProvider } from '@/components/ui/Toast';
import { ThemeProvider } from '@/hooks/useTheme';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} scroll-smooth`}>
            <body className="font-sans" suppressHydrationWarning>
                <ThemeProvider>
                    <ToastProvider>
                        <CustomCursor />
                        <ScrollToTop />
                        {children}
                    </ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
