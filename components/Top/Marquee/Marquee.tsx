import '@/components/Top/Marquee/styles/marquee.scss';

import Image from 'next/image';

interface MarqueeProps {
  number: number;
  color: string;
}

export const Marquee = ({ number, color }: MarqueeProps) => {
  return (
    <div className={`marquee marquee--${number} marquee--${color}`}>
      {Array.from({ length: 6 }).map((_, index) => {
        return (
          <div key={index} className="marquee__inner">
            <div className="marquee__text _en" aria-hidden="true">
              ColorTraining
            </div>
            <div className="marquee__icon">
              <Image src="/images/top/icon-muscle.svg" alt="marquee-icon" width={91} height={92} />
            </div>
            <div className="marquee__decoration">
              <Image
                src="/images/top/decoration-border.svg"
                alt="marquee-icon"
                width={240}
                height={60}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
