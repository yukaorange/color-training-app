'use client';

import '@/app/styles/layout.scss';

import GSAP from 'gsap';

import { ViewPortCalculator } from '@/components/Utility/ViewportCalculator';
import { UserAgent } from '@/components/Utility/UserAgent';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/Layout/Header/Header';
import { Measure } from '@/components/Layout/Measure/Measure';
import { BgGrid } from '@/components/Layout/BgGrid/BgGrid';
import { Waiting } from '@/components/Layout/Waiting/Waiting';

import { editorStore } from '@/store/editorStore';

import { waitingActions, waitingStore } from '@/store/waitingStore';

import { fetchUserData } from '@/app/api/crud';
import { useRef, useState, useEffect } from 'react';
import { Loading } from '@/components/Layout/Loading/Loading';
import { useSnapshot } from 'valtio';

export const LayoutClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  const showHeader = pathname !== '/';
  const showMeasure = pathname !== '/archive';

  const { isLoggedIn } = useSnapshot(editorStore);

  const { isWaiting } = useSnapshot(waitingStore);

  const loadingRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUserData();
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        GSAP.to(loadingRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            setIsLoading(false);
          },
        });
      }
    };

    loadData();
  }, [isLoggedIn]);

  return (
    <>
      <UserAgent />
      <ViewPortCalculator />
      {isWaiting && <Waiting />}
      {isLoading ? (
        <Loading ref={loadingRef} />
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
