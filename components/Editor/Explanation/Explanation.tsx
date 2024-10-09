import '@/components/Editor/Explanation/styles/explanation.scss';

import Image from 'next/image';

export interface ExplanationProps {
  text: string;
  number: number;
  isActive: boolean;
  onClick: () => void;
}

export const Explanation = ({ text, number, isActive, onClick }: ExplanationProps) => {
  const getIconSrc = (): string => {
    switch (number) {
      case 1:
        return '/images/editor/down-three.svg';
      case 2:
        return '/images/editor/down-two.svg';
      case 3:
        return '/images/editor/down-one.svg';
      case 4:
        return '/images/editor/down-reverse.svg';
      default:
        return '';
    }
  };

  return (
    <>
      <div
        className={`explanation _en ${isActive ? 'explanation--is-active' : 'explanation--inactive'}`}
        onClick={() => {
          onClick();
        }}
      >
        <div className="explanation__text">{text}</div>
        <div className="explanation__icon">
          {
            <Image
              src={getIconSrc()}
              alt={`Step ${number}`}
              width={24}
              height={24}
              style={{ width: '100%', height: 'auto' }}
            />
          }
        </div>
        <div className="explanation__bg">
          <Image
            src="/images/editor/how-to-use__frame.svg"
            alt="Explanation frame"
            width={100}
            height={100}
            style={{ width: '100%', height: 'auto' }}
            priority
          />
        </div>
      </div>
    </>
  );
};
