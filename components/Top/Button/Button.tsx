import '@/components/Top/Button/styles/button-top.scss';

import Image from 'next/image';

interface ButtonProps {
  text: string;
  onClick: () => void;
}

export const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <div className="button-top" onClick={onClick}>
      <div className="button-top__text _en">{text}</div>
      <div className="button-top__frames">
        <div className="button-top__frame">
          <Image src="/images/top/frame-up-left.svg" alt="button-frame" width={35} height={31} />
        </div>
        <div className="button-top__frame">
          <Image src="/images/top/frame-up-right.svg" alt="button-frame" width={35} height={31} />
        </div>
        <div className="button-top__frame">
          <Image src="/images/top/frame-lower-left.svg" alt="button-frame" width={35} height={31} />
        </div>
        <div className="button-top__frame">
          <Image
            src="/images/top/frame-lower-right.svg"
            alt="button-frame"
            width={35}
            height={31}
          />
        </div>
      </div>
    </div>
  );
};
