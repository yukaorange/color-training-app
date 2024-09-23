'use client';

import { ViewPortCalculator } from '@/components/Utility/ViewportCalculator';
import { UserAgent } from '@/components/Utility/UserAgent';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/Layout/Header/Header';
import { Measure } from '@/components/Layout/Measure/Measure';
import { BgGrid } from '@/components/Layout/BgGrid/BgGrid';

import '@/app/styles/layout.scss';
import { useRef } from 'react';
import { useLoadState } from '@/hooks/useLoadState';

export const LayoutClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  const showHeader = pathname !== '/';
  const showMeasure = pathname !== '/archive';

  // useLoadState();

  const layoutRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <UserAgent />
      <ViewPortCalculator />
      {/* <div className="dummy" ref={layoutRef}></div> */}
      <div className="layout">
        {showHeader && <Header />}
        {showMeasure && <Measure />}
        {children}
        <BgGrid />
      </div>
    </>
  );
};
