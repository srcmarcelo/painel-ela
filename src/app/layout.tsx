import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ReactQueryClientProvider } from '@/components/react-query-client-provider';
import { AuthProvider } from '@/lib/auth/context';

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
    <ReactQueryClientProvider>
      <html lang='pt-br'>
        <body
          className={cn(
            'min-h-screen overflow-hidden bg-background',
            inter.className
          )}
        >
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
