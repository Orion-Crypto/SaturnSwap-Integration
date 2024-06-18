import Provider from '@/app/provider';
import { MainLayout } from '@/components/Layouts/Main/MainLayout';
import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import './globals.css';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Saturn Swap',
    description: `Cardano's #1 Fastest DEX`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div>
                    <Provider>
                        <MainLayout>{children}</MainLayout>
                    </Provider>
                </div>
            </body>
        </html>
    );
}
