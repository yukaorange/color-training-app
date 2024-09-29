'use client';

import '@/app/styles/layout.scss';
import { ViewPortCalculator } from '@/components/Utility/ViewportCalculator';
import { UserAgent } from '@/components/Utility/UserAgent';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/Layout/Header/Header';
import { Measure } from '@/components/Layout/Measure/Measure';
import { BgGrid } from '@/components/Layout/BgGrid/BgGrid';

import { fetchUserData } from '@/utils/firebase';
import { useRef, useState, useEffect } from 'react';

export const LayoutClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  const showHeader = pathname !== '/';
  const showMeasure = pathname !== '/archive';

  const layoutRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUserData();
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData()
  }, []);

  return (
    <>
      <UserAgent />
      <ViewPortCalculator />
      {isLoading ? (
        <div className="loading">loading</div>
      ) : (
        <div className="layout">
          {showHeader && <Header />}
          {showMeasure && <Measure />}
          {children}
          <BgGrid />
        </div>
      )}
    </>
  );
};
