import type { Metadata, Viewport } from 'next';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
