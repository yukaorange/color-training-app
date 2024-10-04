import type { Metadata, Viewport } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ClientProvider from '@/components/ClientProvider/ClientProvider';

import '@/styles/style.scss';

import { LayoutClient } from '@/app/LayoutClient';

export const metadata: Metadata = {
  title: 'Color Training App',
  description: 'created by takaoka',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ja">
      <body>
        <ClientProvider session={session}>
          <LayoutClient>{children}</LayoutClient>
        </ClientProvider>
      </body>
    </html>
  );
}
