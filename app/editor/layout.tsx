import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Color Training App - エディター',
  description:
    'カラートレーニングアプリのエディターページです。グリッドから色を選択し、色彩センスを磨きましょう。',
  openGraph: {
    title: 'Color Training App - エディター',
    description: 'グリッドから色を選択し、色彩センスを磨きましょう。',
    url: 'https://color-training-app.vercel.app',
    images: [
      {
        url: 'https://color-training-app.vercel.app/ogp.jpg',
        alt: 'Color Training App エディターページ',
      },
    ],
  },
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
