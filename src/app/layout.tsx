import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';

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
      <body className={inter.className}>
        <Navbar />
        <div>{children}</div>
      </body>
    </html>
  );
}
