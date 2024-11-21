'use client';
import '@/app/styles/layout.scss';

import GSAP from 'gsap';
import { usePathname } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { useSnapshot } from 'valtio';

import { fetchUserData } from '@/app/api/crud';
import { BgGrid } from '@/components/Layout/BgGrid/BgGrid';
import { CookieConsent } from '@/components/Layout/CookieConsent/CookieConsent';
import { Header } from '@/components/Layout/Header/Header';
import { Loading } from '@/components/Layout/Loading/Loading';
import { Measure } from '@/components/Layout/Measure/Measure';
import { SVGFileter } from '@/components/Layout/SVGFilter/SVGFilter';
import { Waiting } from '@/components/Layout/Waiting/Waiting';
import { UserAgent } from '@/components/Utility/UserAgent';
import { ViewPortCalculator } from '@/components/Utility/ViewportCalculator';
import { editorStore } from '@/store/editorStore';
import { waitingStore } from '@/store/waitingStore';

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
        if (loadingRef.current) {
          GSAP.to(loadingRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              setIsLoading(false);
            },
          });
        }
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
          <SVGFileter />
          <CookieConsent />
        </div>
      )}
    </>
  );
};
