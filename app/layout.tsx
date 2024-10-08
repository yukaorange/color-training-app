import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { LayoutClient } from '@/app/LayoutClient';
import ClientProvider from '@/components/ClientProvider/ClientProvider';

import type { Metadata, Viewport } from 'next';
import '@/styles/style.scss';


export const metadata: Metadata = {
  title: 'Color Training App',
  description: 'created by takaoka',
  icons: {
    icon: '/favicon/logo.svg',
  },
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
