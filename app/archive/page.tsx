'use client';

import '@/app/archive/styles/archive.scss';
import '@/app/archive/styles/archive-item.scss';
import '@/app/archive/styles/button-archive-delete.scss';

import React, { useState, useCallback } from 'react';
import { useSnapshot } from 'valtio';
import { editorStore, actions } from '@/store/editorStore';
import { WindowConfirmation } from '@/components/Common/WindowConfirmation/WindowConfirmation';
import { ButtonFooter } from '@/components/Archive/ButtonFooter/ButtonFooter';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Archive() {
  const { archivedSets } = useSnapshot(editorStore);
  const { deleteArchivedSet, loadArchivedSet, setCurrentSetId } = actions;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState({
    main: '',
    sub: '',
  });
  const router = useRouter();

  const formatId = useCallback((id: number) => {
    return id.toString().padStart(6, '0');
  }, []);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  }, []);

  const openConfirmation = (action: () => void, message: { main: string; sub: string }) => {
    setConfirmAction(() => action);
    setConfirmMessage(message);
    setIsConfirmOpen(true);
  };

  const closeConfirmation = () => {
    setIsConfirmOpen(false);
  };

  const handleDelete = useCallback(
    (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      openConfirmation(
        () => {
          deleteArchivedSet(id);
          closeConfirmation();
        },
        {
          main: 'このアイテムを削除しますか？',
          sub: '削除したアイテムは元に戻せません。',
        }
      );
    },
    [deleteArchivedSet, openConfirmation, closeConfirmation]
  );

  const handleLoad = useCallback(
    (id: number) => {
      openConfirmation(
        () => {
          loadArchivedSet(id);
          closeConfirmation();
          router.push('/editor');
        },
        {
          main: 'このアイテムを読み込みますか？',
          sub: '現在の編集内容は失われます。',
        }
      );
    },
    [loadArchivedSet, openConfirmation, closeConfirmation, router]
  );

  return (
    <>
      <main className="archive">
        <div className="archive__inner">
          <header className="archive__header">
            <h2 className="archive__heading _en">ARCHIVE</h2>
            <div className="archive__frame">
              <FrameArchive />
            </div>
          </header>
          <div className="archive__body">
            {archivedSets.map((item, index) => {
              const isCurrent = item.id === editorStore.currentSetId;

              return (
                <div
                  key={index}
                  className={`archive-item ${isCurrent ? 'archive-item--current' : ''}`}
                  onClick={() => handleLoad(item.id)}
                >
                  <div className="archive-item__inner">
                    <div className="archive-item__body">
                      <div className="archive-item__row">
                        <div className="archive-item__title _en">Id</div>
                        <div className="archive-item__content _en">{formatId(item.id)}</div>
                      </div>
                      <div className="archive-item__row">
                        <div className="archive-item__title _en">Title</div>
                        <div className="archive-item__content ">{item.title}</div>
                      </div>
                      <div className="archive-item__row">
                        <div className="archive-item__title _en">Date</div>
                        <div className="archive-item__content _en">
                          {formatDate(item.modifiedAt)}
                        </div>
                      </div>
                    </div>
                    <div className="archive-item__indicator">
                      <div className="archive-item__icon">
                        <IconColor
                          colorTop={item.cellColors[14].square}
                          colorMiddle1={item.cellColors[15].square}
                          colorMiddle2={item.cellColors[20].square}
                          colorBottom={item.cellColors[21].square}
                        />
                      </div>
                      <div className="archive-item__delete">
                        <ButtonArchiveDelete
                          onClick={(e: React.MouseEvent) => {
                            handleDelete(e, item.id);
                          }}
                          isCurrent={isCurrent}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="archive-item__corner">
                    <Corner />
                  </div>
                </div>
              );
            })}
          </div>
          <footer className="archive__footer">
            <ButtonFooter />
          </footer>
        </div>
      </main>
      <WindowConfirmation
        isOpen={isConfirmOpen}
        onConfirm={confirmAction}
        onCancel={closeConfirmation}
        message={confirmMessage.main}
        subMessage={confirmMessage.sub}
      />
    </>
  );
}

interface ButtonArchiveDeleteProps {
  onClick: (e: React.MouseEvent) => void;
  isCurrent: boolean;
}
const ButtonArchiveDelete = ({ onClick, isCurrent }: ButtonArchiveDeleteProps) => {
  return (
    <div
      className={`button-archive-delete ${isCurrent ? 'button-archive-delete--disabled' : ''}`}
      onClick={onClick}
    >
      {isCurrent ? '編集中' : 'Delete'}
    </div>
  );
};

const FrameArchive = () => {
  return (
    <svg
      id=""
      data-name=""
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1273 98"
      width={1273}
      height={98}
      className="frame-archive"
    >
      <defs>
        <style>
          {`
            .frame-archive__line {
              fill: none;
              stroke: #0d0d0d;
              stroke-miterlimit: 10;
              stroke-width: 0.15rem;
            }
          `}
        </style>
      </defs>
      <g id="" data-name="">
        <polyline className="frame-archive__line" points="0 97 24 97 354 97 432 1 1272 1" />
      </g>
    </svg>
  );
};

const Corner = () => {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="icon-corner"
    >
      <g clipPath="url(#clip0_218_9658)">
        <path d="M0 0V16L16 0H0Z" fill="#5f5f5f" />
      </g>
      <defs>
        <clipPath id="clip0_218_9658">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

interface ColorfulTrianglesProps {
  width?: number;
  height?: number;
  className?: string;
  colorTop?: string;
  colorMiddle1?: string;
  colorMiddle2?: string;
  colorBottom?: string;
}
const IconColor = ({
  width = 40,
  height = 40,
  className = '',
  colorTop,
  colorMiddle1,
  colorMiddle2,
  colorBottom,
}: ColorfulTrianglesProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_218_9677)">
        <path d="M40 3.33333V0H33.3333L0 25V33.3333L40 3.33333Z" fill={colorTop} />
        <path d="M21.1111 0H10L0 7.5V15.8333L21.1111 0Z" fill={colorMiddle1} />
        <path d="M39.9999 20.8333V12.5L3.33325 40H14.4444L39.9999 20.8333Z" fill={colorMiddle2} />
        <path d="M40.0001 38.3333V30L26.6667 40H37.7779L40.0001 38.3333Z" fill={colorBottom} />
      </g>
      <defs>
        <clipPath id="clip0_218_9677">
          <rect width="40" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
