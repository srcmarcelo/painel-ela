import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { DataProvider } from '@/lib/context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ELA - Painel de Controle',
  description: 'Gerenciamento Geral',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-br'>
      <body
        className={cn(
          'min-h-screen overflow-hidden bg-background',
          inter.className
        )}
      >
        <DataProvider>
          <div className='overflow-auto h-screen'>
            <Navbar />
            <main>{children}</main>
          </div>
          <Toaster />
        </DataProvider>
      </body>
    </html>
  );
}
