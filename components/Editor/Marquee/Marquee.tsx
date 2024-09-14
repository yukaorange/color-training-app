import '@/components/Editor/Marquee/styles/marquee.scss';

import Image from 'next/image';

interface MarqueeProps {
  number: number;
}

export const Marquee = ({ number }: MarqueeProps) => {
  return (
    <div className={`marquee-editor marquee-editor--${number} `}>
      {Array.from({ length: 6 }).map((_, index) => {
        return (
          <div className="marquee-editor__inner" key={index}>
            <div className="marquee-editor__text _en" aria-hidden="true">
              ColorTraining
            </div>
            <div className="marquee-editor__icon">
              <Image
                src="/images/editor/icon-muscle.svg"
                alt="marquee-editor-icon"
                width={91}
                height={92}
              />
            </div>
            <div className="marquee-editor__decoration">
              <Image
                src="/images/editor/decoration-border.svg"
                alt="marquee-editor-icon"
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
