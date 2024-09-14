import '@/components/Editor/WindowSave/styles/window-save.scss';
import '@/components/Editor/WindowSave/styles/toggle-window-save.scss';
import '@/components/Editor/WindowSave/styles/project.scss';
import '@/components/Editor/WindowSave/styles/button-save.scss';

import { Marquee } from '@/components/Editor/Marquee/Marquee';

interface WindowSaveProps {
  onClick: () => void;
  isOpen: boolean;
}

export const WindowSave = ({ onClick, isOpen }: WindowSaveProps) => {
  const ToggleWindowSave = ({ isOpen }: { isOpen: boolean }) => {
    return (
      <>
        <div className={`toggle-window-save ${isOpen ? 'toggle-window-save--close' : ''} _en`}>
          <div className="toggle-window-save__text">{isOpen ? 'CLOSE' : 'SAVE'}</div>
          <div className="toggle-window-save__icon">
            <Arrow />
          </div>
        </div>
      </>
    );
  };

  const Arrow = () => {
    return (
      <svg
        width={24}
        height={16}
        viewBox="0 0 24 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g id="arrow-down">
          <path
            id="Vector"
            d="M0 0.83786L12 8.00002L24 0.83786V3.22644L12 10.3886L0 3.22644V0.83786Z"
            fill="#0D0D0D"
          />
          <path
            id="Vector_2"
            d="M0 5.61142L12 12.7736L24 5.61142V8L12 15.1622L0 8V5.61142Z"
            fill="#0D0D0D"
          />
        </g>
      </svg>
    );
  };

  const Corner = () => {
    return (
      <svg
        width={40}
        height={40}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0V40L40 0H0Z" fill="#5f5f5f" />
      </svg>
    );
  };

  const ButtonSave = () => {
    return (
      <div className="button-save">
        <div className="button-save__text _en">Sign In</div>
      </div>
    );
  };

  return (
    <>
      <div className={`window-save ${isOpen ? 'window-save--is-open' : ''}`}>
        <div
          className={`window-save__toggle ${isOpen ? 'window-save__toggle--is-open' : ''}`}
          onClick={onClick}
        >
          <ToggleWindowSave isOpen={isOpen} />
        </div>
        <div className="window-save__inner">
          <div className="project">
            <div className="project__row">
              <div className="project__label _en">ID</div>
              <div className="project__content _en">000</div>
            </div>
            <div className="project__row">
              <div className="project__label _en">Title</div>
              <input type="text" className="project__content" placeholder="タイトル" />
            </div>
            <div className="project__row">
              <div className="project__label _en">Date</div>
              <div className="project__daproject__content _en">2024/01/01</div>
            </div>
          </div>
          <ButtonSave />
        </div>
        <div className="window-save__corner">
          <Corner />
        </div>
        <div className="window-save__marquee">
          <Marquee number={1} />
          <Marquee number={2} />
        </div>
      </div>
      <div
        className={`window-save__overlay ${isOpen ? 'window-save__overlay--is-open' : ''}`}
        onClick={onClick}
      ></div>
    </>
  );
};
