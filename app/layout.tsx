import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Portfolio Admin',
    description: 'Manage tasks and projects',
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
