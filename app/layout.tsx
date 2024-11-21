import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { LayoutClient } from '@/app/LayoutClient';
import ClientProvider from '@/components/ClientProvider/ClientProvider';

import type { Metadata, Viewport } from 'next';
import '@/styles/style.scss';

export const metadata: Metadata = {
  title: 'Color Training App',
  description:
    '幻冬舎刊、前田高志様の著書「勝てるデザイン」にて紹介されている色彩センスを身に付けるためのワークを参考に作成したアプリケーションです。',
  icons: {
    icon: '/favicon/logo.svg',
  },
  openGraph: {
    title: 'Color Training App',
    description:
      '幻冬舎刊、前田高志様の著書「勝てるデザイン」にて紹介されている色彩センスを身に付けるためのワークを参考に作成したアプリケーションです。',
    url: 'https://color-training-app.vercel.app/',
    siteName: 'Color Training App',
    images: [
      {
        url: 'https://color-training-app.vercel.app/ogp.jpg',
        width: 1169,
        height: 735,
        alt: 'Color Training App',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color Training App',
    description:
      '幻冬舎刊、前田高志様の著書「勝てるデザイン」にて紹介されている色彩センスを身に付けるためのワークを参考に作成したアプリケーションです。',
    images: ['https://color-training-app.vercel.app/ogp.jpg'],
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
