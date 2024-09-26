'use client';

import '@/components/Editor/Button/styles/button-editor.scss';

import { actions, editorStore } from '@/store/editorStore';
import { useSnapshot } from 'valtio';

interface ButtonProps {
  indicate: string;
  disabled: boolean;
}

export const Button = ({ indicate, disabled }: ButtonProps) => {
  const handleClick = () => {
    if (indicate === 'right') {
      actions.redo();
    } else {
      actions.undo();
    }
  };

  return (
    <div
      className={`button-editor button-editor--${indicate} ${disabled ? 'button-editor--is-disabled ' : ''}`}
      onClick={handleClick}
    >
      {indicate === 'right' ? (
        <svg
          className="button-editor__icon"
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="button-right">
            <path
              id="button__frame"
              d="M0.594971 0V71.405H58.1176L71.9999 57.5226V0H0.594971Z"
              fill="white"
              stroke="#0d0d0d"
              strokeMiterlimit="10"
            />
            <path
              id="button__arrow"
              d="M28.3655 17.8512V53.5537L48.1982 35.7025L28.3655 17.8512Z"
              fill="#0d0d0d"
            />
          </g>
        </svg>
      ) : (
        <svg
          className="button-editor__icon"
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="button-left">
            <path
              id="button__frame"
              d="M71.405 0L6.86646e-05 0V57.5226L13.8824 71.405H71.405L71.405 0Z"
              fill="white"
              stroke="#0d0d0d"
              strokeMiterlimit="10"
            />
            <path
              id="button__arrow"
              d="M41.6528 53.5537V17.8512L21.8201 35.7025L41.6528 53.5537Z"
              fill="#0d0d0d"
            />
          </g>
        </svg>
      )}
    </div>
  );
};
