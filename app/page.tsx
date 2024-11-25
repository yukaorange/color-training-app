'use client';

import '@/app/styles/top.scss';
import '@/app/styles/text-loop.scss';

import GSAP from 'gsap';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/Top/Button/Button';
import { Marquee } from '@/components/Top/Marquee/Marquee';
import { useAnimatedRouter } from '@/hooks/useAnimatedRouter';

export default function Top() {
  const { animationAndNavigate } = useAnimatedRouter();

  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = topRef.current;
    if (!element) return;

    const textLoop = element.querySelector('.text-loop');

    const marqueeContainer = element.querySelector('.top__marquee');

    const marquees = element.querySelectorAll('.marquee');

    const tl = GSAP.timeline();

    tl.set(element, { opacity: 0.5 });

    tl.to(element, {
      delay: 0.5,
      opacity: 1,
      duration: 0.2,
      ease: 'power2.out',
      // onUpdate: () => {
      //   console.log('animation');
      // },
    });
    tl.to(marqueeContainer, {
      opacity: 1,
      duration: 0.2,
      ease: 'power2.out',
    });
    tl.to(marquees, {
      delay: 0.5,
      duration: 0,
      onComplete: () => {
        marquees.forEach((marquee) => {
          marquee.classList.add('marquee--is-show');
        });
      },
    });
    tl.to(textLoop, {
      delay: 0.2,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
      // onUpdate: () => {
      //   console.log('animation');
      // },
    });
  }, []);

  const handleNavigate = (href: string) => {
    const element = topRef.current;
    const tl = GSAP.timeline();

    tl.to(element, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    });

    animationAndNavigate(href, tl);
  };

  return (
    <main>
      <div className="top" ref={topRef} style={{ opacity: 0 }}>
        <div className="top__inner">
          <div className="top__buttons">
            <Button text="EDITOR" onClick={() => handleNavigate('/editor')} />
            <Button text="ARCHIVE" onClick={() => handleNavigate('/archive')} />
          </div>
          <div className="top__text-loop">
            <div className="text-loop" style={{ opacity: 0 }}>
              {Array.from({ length: 2 }).map((_, index) => {
                return (
                  <div key={index} className="text-loop__col">
                    <p className="text-loop__text">
                      6x6 マスの 3D
                      色彩表示グリッドに着色し、色彩感覚を養うためのアプリケーションです。
                    </p>
                    <p className="text-loop__text text-loop--en">
                      This is an application for improving color sense by 6x6 grid.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <p className={'top__attention'}>
            ※書籍『勝てるデザイン』(前田高志著、幻冬舎刊)
            の美術課題を参考にしています。色彩感覚を養うことを目的とされる場合は、当アプリ上で行うのではなく、必ずケント紙と不透明水彩絵の具を用いてアナログで行うようにしてください。
          </p>
        </div>
        <div className="top__marquee" style={{ opacity: 0 }}>
          <Marquee number={1} color="green" />
          <Marquee number={2} color="red" />
          <Marquee number={3} color="green" />
          <Marquee number={4} color="red" />
        </div>
      </div>
    </main>
  );
}
