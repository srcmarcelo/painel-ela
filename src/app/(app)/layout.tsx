import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { DataProvider } from '@/lib/data/context';
import { ReactQueryClientProvider } from '@/components/react-query-client-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <DataProvider>
        <div className='overflow-auto h-screen pb-10'>
          <Navbar />
          <main>{children}</main>
        </div>
        <Toaster />
      </DataProvider>
    </ReactQueryClientProvider>
  );
}
