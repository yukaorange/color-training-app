import '@/components/Top/Marquee/styles/marquee.scss';

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
              {/* <Image src="/images/top/icon-muscle.svg" alt="marquee-icon" width={91} height={92} /> */}
              <IconMuscle />
            </div>
            <div className="marquee__decoration">
              {/* <Image
                src="/images/top/decoration-border.svg"
                alt="marquee-icon"
                width={240}
                height={60}
              /> */}
              <DecorationBorder />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DecorationBorder = () => {
  return (
    <svg
      width="241"
      height="60"
      viewBox="0 0 241 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_124_11097)">
        <path
          d="M105.618 0.0447998L55.6177 59.8729H70.6177L120.618 0.0447998L105.618 0.0447998Z"
          fill="#0D0D0D"
        />
        <path
          d="M70.6177 0.0447998L20.6177 59.8729H35.6177L85.6177 0.0447998L70.6177 0.0447998Z"
          fill="#0D0D0D"
        />
        <path
          d="M35.6177 0.0447998L0.617676 41.9245L0.617676 59.8729L50.6177 0.0447998L35.6177 0.0447998Z"
          fill="#0D0D0D"
        />
        <path
          d="M15.6177 0.0447998L0.617676 0.0447998L0.617676 17.9932L15.6177 0.0447998Z"
          fill="#0D0D0D"
        />
        <path d="M240.618 6.02759L195.618 59.8729H210.618L240.618 23.976V6.02759Z" fill="#0D0D0D" />
        <path
          d="M210.618 0.0447998L160.618 59.8729H175.618L225.618 0.0447998L210.618 0.0447998Z"
          fill="#0D0D0D"
        />
        <path
          d="M140.618 0.0447998L90.6177 59.8729H105.618L155.618 0.0447998L140.618 0.0447998Z"
          fill="#0D0D0D"
        />
        <path d="M230.618 59.8728H240.618V47.9072L230.618 59.8728Z" fill="#0D0D0D" />
        <path
          d="M175.618 0.0447998L125.618 59.8729H140.618L190.618 0.0447998L175.618 0.0447998Z"
          fill="#0D0D0D"
        />
      </g>
      <defs>
        <clipPath id="clip0_124_11097">
          <rect
            width="240"
            height="59.8281"
            fill="white"
            transform="translate(0.617676 0.0447998)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

const IconMuscle = () => {
  return (
    <svg width={92} height={93} viewBox="0 0 92 93" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.6299 62.9121L27.3239 70.0457H66.5334L75.4468 62.9121V23.6986L68.3193 16.5703H57.6253L54.0588 20.1318V27.2654L57.6253 30.8269L66.5334 30.8269V45.0888L62.9723 46.8695L50.4924 32.6129H29.1044L16.6299 46.8695L16.6299 62.9121Z"
        fill="#0D0D0D"
      />
      <path d="M29.1045 14.7843H32.6709L29.1045 25.4794" fill="#0D0D0D" />
      <path d="M21.9771 20.1319L25.5435 18.3512V25.4795" fill="#0D0D0D" />
      <path d="M18.4104 21.918L16.6299 23.6987L23.7574 29.0462" fill="#0D0D0D" />
    </svg>
  );
};
