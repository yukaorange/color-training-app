'use client';

import '@/components/Layout/Header/styles/header.scss';
import '@/components/Layout/Header/styles/icon-user.scss';
import '@/components/Layout/Header/styles/icon-setting.scss';
import '@/components/Layout/Header/styles/overlay-setting.scss';
import '@/components/Layout/Header/styles/window-setting.scss';
import '@/components/Layout/Header/styles/button-setting.scss';

import { WindowConfirmation } from '@/components/Layout/Header/WindowConfirmation/WindowConfirmation';

import { useSnapshot } from 'valtio';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { actions } from '@/store/editorStore';
import { editorStore } from '@/store/editorStore';

export const Header = () => {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState({
    main: '',
    sub: '',
  });

  const { currentSetId, isHistoryChanged, localTitle } = useSnapshot(editorStore);

  const {
    resetToInitial,
    generateRandomColors,
    updateArchivedSet,
    archiveCurrentSet,
    setCurrentSetId,
    resetLocalTitle,
  } = actions;

  const toggleSetting = () => {
    setIsSettingOpen((prev) => !prev);
  };

  const openConfirmation = (action: () => void, message: { main: string; sub: string }) => {
    setConfirmAction(() => action);
    setConfirmMessage(message);
    setIsConfirmOpen(true);
  };

  const closeConfirmation = () => {
    setIsConfirmOpen(false);
  };

  const handleNewCreation = () => {
    openConfirmation(
      () => {
        if (currentSetId || isHistoryChanged) {
          const titleToUse = localTitle.trim() || 'Untitled';
          if (currentSetId) {
            updateArchivedSet(currentSetId as string, titleToUse);
          } else {
            archiveCurrentSet(titleToUse);
          }
        }

        resetToInitial();
        setCurrentSetId(null);
        resetLocalTitle();
        setIsSettingOpen(false);
        closeConfirmation();
      },
      {
        main: '新規作成しますか？',
        sub: '現在の編集内容はアーカイブされます。',
      }
    );
  };

  const handleClose = () => {
    setIsSettingOpen(false);
  };

  const handleDelete = () => {
    openConfirmation(
      () => {
        resetToInitial();
        setIsSettingOpen(false);
        closeConfirmation();
      },
      {
        main: '現在の内容を削除しますか？',
        sub: 'この操作は元に戻せません。',
      }
    );
  };

  const handleRandomGeneration = () => {
    openConfirmation(
      () => {
        generateRandomColors();
        setIsSettingOpen(false);
        closeConfirmation();
      },
      {
        main: 'ランダムに色を生成しますか？',
        sub: '現在の編集内容は破棄されます。',
      }
    );
  };

  return (
    <>
      <header className="header">
        <div className="header__inner">
          <Link href="/" className="header__title-logo">
            <div className="header__title _en">Color Training</div>
            <div className="header__logo">
              <Logo />
            </div>
          </Link>
          <div className="header__buttons">
            <IconUser isLogin={false} />
            <SettingIcon onClick={toggleSetting} />
          </div>
        </div>
      </header>
      <div
        className={`window-setting ${isSettingOpen ? 'window-setting--is-open' : 'window-setting--is-close'}`}
      >
        <div className="window-setting__inner">
          <div className="window-setting__buttons">
            <div className="button-setting button-setting--new" onClick={handleNewCreation}>
              <div className="button-setting__text _en">NEW</div>
              <div className="button-setting__icon">
                <IconAdd />
              </div>
            </div>
            <div className="button-setting button-setting--delete" onClick={handleDelete}>
              <div className="button-setting__text _en">DELETE</div>
              <div className="button-setting__icon">
                <IconDanger />
              </div>
            </div>
          </div>
          <div className="window-setting__buttons">
            <div className="button-setting button-setting--random" onClick={handleRandomGeneration}>
              <div className="button-setting__text _en">RANDOM</div>
            </div>
          </div>
        </div>

        <div className="window-setting__corner">
          <Corner />
        </div>
        <div className="window-setting__close">
          <ButtonClose onClick={handleClose} />
        </div>
      </div>
      <div
        className={`overlay-setting ${isSettingOpen ? 'overlay-setting--is-open' : 'overlay-setting--is-close'}`}
        onClick={handleClose}
      ></div>
      <WindowConfirmation
        isOpen={isConfirmOpen}
        onConfirm={confirmAction}
        onCancel={closeConfirmation}
        message={confirmMessage.main}
        subMessage={confirmMessage.sub}
      />
    </>
  );
};

const Logo = () => {
  return <Image src="/images/header/logo.svg" alt="to be muscle" width={72} height={72} />;
};

const IconUser = ({ isLogin }: { isLogin: boolean }) => {
  return (
    <svg
      className={`icon-user ${isLogin ? 'icon-user--is-login' : ''}`}
      width="72"
      height="80"
      viewBox="0 0 72 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M48 29C48 35.6274 42.6273 41 36 41C29.3726 41 24 35.6274 24 29C24 22.3726 29.3726 17 36 17C42.6273 17 48 22.3726 48 29Z"
        fill="#A2A2A2"
        stroke="#0D0D0D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 47C26.0589 47 18 54.1634 18 63H54C54 54.1634 45.9411 47 36 47Z"
        fill="#A2A2A2"
        stroke="#0D0D0D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const SettingIcon = ({ onClick }: { onClick: () => void }) => {
  const Icon = () => {
    return (
      <svg
        width="40"
        height="41"
        viewBox="0 0 40 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="icon-setting__icon"
      >
        <path
          id="icon__vector-gear"
          d="M38.75 23.4675C39.4555 23.4125 40 22.823 40 22.116V18.8835C40 18.1755 39.4555 17.587 38.75 17.531L34.4666 17.1965C34.1946 17.1755 33.9601 17.005 33.8551 16.752L32.4466 13.3525C32.3416 13.101 32.3856 12.813 32.5636 12.6065L35.3566 9.34C35.8156 8.8015 35.7861 8.001 35.2846 7.5005L32.9996 5.2155C32.4991 4.715 31.6971 4.683 31.1601 5.1435L27.8937 7.9365C27.6872 8.1135 27.3982 8.1585 27.1477 8.055L23.7467 6.645C23.4952 6.541 23.3232 6.303 23.3012 6.0335L22.9677 1.751C22.9127 1.0445 22.3242 0.5 21.6162 0.5H18.3838C17.6758 0.5 17.0873 1.0445 17.0323 1.7515L16.6978 6.034C16.6768 6.305 16.5048 6.542 16.2533 6.6455L12.8523 8.0555C12.6008 8.1595 12.3128 8.114 12.1053 7.937L8.83989 5.144C8.3029 4.684 7.50191 4.7155 7.00041 5.216L4.71544 7.501C4.21495 8.0015 4.18445 8.802 4.64344 9.3405L7.43641 12.607C7.6124 12.8135 7.6584 13.1015 7.55341 13.353L6.14492 16.7525C6.04242 17.005 5.80443 17.176 5.53443 17.197L1.24998 17.5315C0.544493 17.5875 0 18.176 0 18.884V22.115C0 22.823 0.544493 23.4125 1.24998 23.4675L5.53443 23.801C5.80443 23.823 6.04242 23.995 6.14492 24.2465L7.55341 27.646C7.6584 27.8975 7.6119 28.187 7.43641 28.393L4.64344 31.6595C4.18445 32.1965 4.21495 32.9975 4.71544 33.499L7.00041 35.784C7.50191 36.2845 8.3029 36.315 8.83989 35.855L12.1053 33.062C12.3128 32.886 12.6008 32.84 12.8523 32.945L16.2533 34.3535C16.5048 34.4585 16.6768 34.694 16.6978 34.9665L17.0323 39.249C17.0873 39.9545 17.6758 40.5 18.3838 40.5H21.6162C22.3242 40.5 22.9127 39.9545 22.9677 39.249L23.3012 34.9665C23.3232 34.6945 23.4952 34.4585 23.7467 34.3535L27.1477 32.945C27.3977 32.84 27.6887 32.8865 27.8937 33.062L31.1601 35.855C31.6971 36.315 32.4991 36.2845 32.9996 35.784L35.2846 33.499C35.7861 32.9975 35.8156 32.1965 35.3566 31.6595L32.5636 28.393C32.3876 28.1865 32.3416 27.8975 32.4466 27.646L33.8551 24.2465C33.9601 23.995 34.1946 23.823 34.4666 23.801L38.75 23.4675ZM20.0002 27.259C18.1948 27.259 16.4968 26.556 15.2198 25.28C13.9428 24.002 13.2398 22.305 13.2398 20.4985C13.2398 18.692 13.9428 16.995 15.2198 15.7195C16.4968 14.4415 18.1948 13.7395 20.0002 13.7395C21.8057 13.7395 23.5037 14.4415 24.7807 15.7195C26.0577 16.995 26.7607 18.693 26.7607 20.4985C26.7607 22.304 26.0577 24.002 24.7807 25.28C23.5037 26.5555 21.8072 27.259 20.0002 27.259Z"
          fill="currentColor"
        />
      </svg>
    );
  };

  return (
    <>
      <div className="icon-setting" onClick={onClick}>
        <Icon />
        <div className="icon-setting__text _en">setting</div>
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
