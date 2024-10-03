import '@/components/Layout/Header/WindowSetting/styles/overlay-setting.scss';
import '@/components/Layout/Header/WindowSetting/styles/window-setting.scss';
import '@/components/Layout/Header/WindowSetting/styles/button-setting.scss';

import { useSnapshot } from 'valtio';

import { actions } from '@/store/editorStore';
import { editorStore } from '@/store/editorStore';
import { waitingStore, waitingActions } from '@/store/waitingStore';

interface WindowSettingProps {
  isOpen: boolean;
  onClose: () => void;
  openConfirmation: (action: () => void, message: { main: string; sub: string }) => void;
}

export const WindowSetting = ({ isOpen, onClose, openConfirmation }: WindowSettingProps) => {
  const { currentSetId, isHistoryChanged, localTitle } = useSnapshot(editorStore);

  const {
    resetToInitial,
    generateRandomColors,
    updateArchivedSet,
    archiveCurrentSet,
    setCurrentSetId,
    resetLocalTitle,
  } = actions;

  const { setIsWaiting } = waitingActions;
  const { isWaiting } = useSnapshot(waitingStore);

  const handleNewCreation = () => {
    openConfirmation(
      async () => {
        if (currentSetId || isHistoryChanged) {
          setIsWaiting(true);
          try {
            const titleToUse = localTitle.trim() || '無題';

            if (currentSetId) {
              console.log('updating');

              await updateArchivedSet(currentSetId, titleToUse);

              console.log('updated');
            } else {
              console.log('archiving');

              await archiveCurrentSet(titleToUse);

              console.log('archived');
            }
          } catch (err) {
            console.error(err);
          } finally {
            setIsWaiting(false);
          }
        }

        resetToInitial();
        setCurrentSetId(null);
        resetLocalTitle();
        onClose();
      },
      {
        main: '新規作成しますか？',
        sub: '現在の編集内容は保存されます。',
      }
    );
  };

  const handleDelete = () => {
    openConfirmation(
      () => {
        resetToInitial();
        onClose();
      },
      {
        main: 'リセットしますか？',
        sub: '編集内容が破棄されます。',
      }
    );
  };

  const handleRandomGeneration = () => {
    openConfirmation(
      () => {
        generateRandomColors();
        onClose();
      },
      {
        main: '色を生成しますか？',
        sub: '現在の編集内容は破棄されます。',
      }
    );
  };

  interface ButtonSettingProps {
    onClick: () => void;
    type: 'new' | 'delete';
  }
  const ButtonSetting = ({ onClick, type }: ButtonSettingProps) => {
    const text = type == 'new' ? 'NEW' : 'RESET';
    const icon = type == 'new' ? <IconAdd /> : <IconDanger />;

    return (
      <div className={`button-setting button-setting--${type}`} onClick={onClick}>
        <div className="button-setting__text _en">{text}</div>
        <div className="button-setting__icon">{icon}</div>
      </div>
    );
  };

  interface ButtonRandomProps {
    onClick: () => void;
  }
  const ButtonRandom = ({ onClick }: ButtonRandomProps) => {
    return (
      <div className="button-setting button-setting--random" onClick={onClick}>
        <div className="button-setting__text _en">RANDOM</div>
        <div className="button-setting__mask"></div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`window-setting ${isOpen ? 'window-setting--is-open' : 'window-setting--is-close'}`}
      >
        <div className="window-setting__inner">
          <div className="window-setting__buttons">
            <ButtonSetting onClick={handleNewCreation} type="new" />
            <ButtonSetting onClick={handleDelete} type="delete" />
          </div>
          <div className="window-setting__buttons">
            <ButtonRandom onClick={handleRandomGeneration} />
          </div>
        </div>

        <div className="window-setting__corner">
          <Corner />
        </div>
        <div className="window-setting__close">
          <ButtonClose onClick={onClose} />
        </div>
      </div>
      <div
        className={`overlay-setting ${isOpen ? 'overlay-setting--is-open' : 'overlay-setting--is-close'}`}
        onClick={onClose}
      ></div>
      <div className="button-setting-svg-filter">
        <svg width="0" height="0">
          <filter id="color-change-filter">
            <animate
              attributeName="color-interpolation-filters"
              values="sRGB; linear-rgb; sRGB"
              dur="5s"
              repeatCount="indefinite"
            />
            <feColorMatrix type="hueRotate" values="0">
              <animate
                attributeName="values"
                values="0; 360; 0"
                dur="8s"
                repeatCount="indefinite"
              />
            </feColorMatrix>
          </filter>
          <filter id="color-change-filter-2">
            <animate
              attributeName="color-interpolation-filters"
              values="sRGB; linear-rgb; sRGB"
              dur="5s"
              repeatCount="indefinite"
            />
            <feColorMatrix type="hueRotate" values="0">
              <animate
                attributeName="values"
                values="0; 60; 0; 240; 0; 180; 0;"
                dur="3s"
                repeatCount="indefinite"
              />
            </feColorMatrix>
          </filter>
        </svg>
      </div>
    </>
  );
};

const IconAdd = () => {
  return (
    <svg
      id="icon-add"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 37 37"
      width={37}
      height={37}
      className="icon-add"
    >
      <defs>
        <style>
          {`
          .cls-1 {
            fill: none;
          }
          .cls-1, .cls-2 {
            stroke: currentColor;
            stroke-miterlimit: 10;
          }
        `}
        </style>
      </defs>
      <g id="layer">
        <line className="cls-2" x1="18.5" y1="5" x2="18.5" y2="32" />
        <line className="cls-2" x1="5" y1="18.5" x2="32" y2="18.5" />
        <polyline className="cls-1" points=".5 5 .5 .5 5 .5" />
        <polyline className="cls-1" points="32 .5 36.5 .5 36.5 5" />
        <polyline className="cls-1" points="36.5 32 36.5 36.5 32 36.5" />
        <polyline className="cls-1" points=".5 32 .5 36.5 5 36.5" />
      </g>
    </svg>
  );
};

const IconDanger = () => {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="icon-danger"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.98828L22.2924 21H1.70764L12 2.98828ZM4.29241 19.5H19.7076L12 6.01163L4.29241 19.5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.25 15L11.25 10.5L12.75 10.5L12.75 15L11.25 15Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.25 17.25L11.25 15.75L12.75 15.75L12.75 17.25L11.25 17.25Z"
        fill="currentColor"
      />
    </svg>
  );
};

const Corner = () => {
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0V40L40 0H0Z" fill="#5f5f5f" />
    </svg>
  );
};

const ButtonClose = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      id="button-close"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 41.5 41.5"
      width={41.5}
      height={41.5}
      className="button-close"
      onClick={onClick}
    >
      <defs>
        <style>
          {`
          .cls-1 {
            fill: none;
            stroke: currentColor;
            stroke-linecap: round;
            stroke-miterlimit: 10;
            stroke-width: 1.5px;
          }
        `}
        </style>
      </defs>
      <g id="" data-name="">
        <g id="button-close__lines">
          <line className="cls-1" x1=".75" y1=".75" x2="17.42" y2="17.42" />
          <line className="cls-1" x1="24.08" y1="17.42" x2="40.75" y2=".75" />
          <line className="cls-1" x1="24.08" y1="24.08" x2="40.75" y2="40.75" />
          <line className="cls-1" x1=".75" y1="40.75" x2="17.42" y2="24.08" />
        </g>
      </g>
    </svg>
  );
};
