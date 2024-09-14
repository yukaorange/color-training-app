import '@/components/Layout/Measure/styles/measure.scss';
import { useRef, useState, useEffect } from 'react';

export const Measure = () => {
  const [mouseIndex, setMouseIndex] = useState<number | null>(null);

  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!measureRef.current) return;

      const rect = measureRef.current.getBoundingClientRect();

      const y = event.clientY - rect.top;

      const index = Math.floor(y / (rect.height / 30));

      setMouseIndex(index);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="measure" ref={measureRef}>
      <svg
        className="measure__image"
        width="30"
        height="597"
        viewBox="0 0 60 597"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 31 }).map((_, index) => {
          return (
            <path
              className={`${index === mouseIndex ? 'measure__line--active' : ''} ${index === mouseIndex! - 1 ? 'measure__line--prev' : ''} ${index === mouseIndex! + 1 ? 'measure__line--next' : ''} measure__line`}
              key={index}
              d={`M${index % 5 === 0 ? '30' : '20'} ${index * 19.8454}H0`}
              stroke="#A2A2A2"
              strokeMiterlimit="10"
            />
          );
        })}
      </svg>
    </div>
  );
};
