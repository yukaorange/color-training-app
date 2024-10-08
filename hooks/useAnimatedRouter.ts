import { useRouter } from 'next/navigation';
import { useRef, useCallback } from 'react';

export const useAnimatedRouter = () => {
  const router = useRouter();

  const routerRef = useRef(router);

  routerRef.current = router;

  const animationAndNavigate = useCallback((href: string, timeline: any) => {
    timeline.eventCallback('onComplete', () => {
      routerRef.current.push(href);
    });

    timeline.play();
  }, []);

  return { animationAndNavigate };
};
