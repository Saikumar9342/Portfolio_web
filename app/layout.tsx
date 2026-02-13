import type { Metadata } from 'next'
import './globals.css'

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
        <html lang="en" className="scroll-smooth">
            <body>
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
