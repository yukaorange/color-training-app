import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Color Training App - アーカイブ',
  description: 'カラートレーニングアプリのアーカイブです。編集するアーカイブを選択しましょう。',
  openGraph: {
    title: 'Color Training App - アーカイブ',
    description: 'グリッドから色を選択し、色彩センスを磨きましょう。',
    url: 'https://color-training-app.vercel.app',
    images: [
      {
        url: 'https://color-training-app.vercel.app/ogp.jpg',
        alt: 'Color Training App アーカイブ',
      },
    ],
  },
};

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
