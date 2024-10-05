'use client';

import '@/app/archive/styles/archive.scss';

import { ArchiveItem } from '@/components/Archive/ArchiveItem/ArchiveItem';

import { waitingStore, waitingActions } from '@/store/waitingStore';

import GSAP from 'gsap';
import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { editorStore, actions } from '@/store/editorStore';
import { WindowConfirmation } from '@/components/Common/WindowConfirmation/WindowConfirmation';
import { ButtonFooter } from '@/components/Archive/ButtonFooter/ButtonFooter';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { set } from 'lodash';
import { Pagination } from '@/components/Archive/Pagination/pagination';
import { useEffect } from 'react';

const ITEMS_PER_PAGE = 10;

export default function Archive() {
  const router = useRouter();
  const snapshot = useSnapshot(editorStore);
  const { currentSetId, isHistoryChanged, localTitle, archivedSets } = snapshot;
  // const { isWaiting } = useSnapshot(waitingStore);
  const { setIsWaiting } = waitingActions;
  const { updateArchivedSet, archiveCurrentSet, deleteArchivedSet, loadArchivedSet } = actions;

  const [currentItems, setCurrentItems] = useState(archivedSets);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState({
    main: '',
    sub: '',
  });

  const archiveItemRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const totalPages = useMemo(() => Math.ceil(archivedSets.length / ITEMS_PER_PAGE), [archivedSets]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    let newPage = 0;

    if (currentSetId) {
      const index = archivedSets.findIndex((set) => set.id === currentSetId);
      if (index !== -1) {
        newPage = Math.floor(index / ITEMS_PER_PAGE) + 1;
      }
    } else if (archivedSets.length < 1) {
      newPage = 0;
    } else {
      newPage = 1;
    }
    setCurrentPage(newPage);
  }, [archivedSets, currentSetId]);

  useEffect(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

    console.log(
      'archivedSets : ',
      archivedSets,
      'indexOfFirstItem:',
      indexOfFirstItem,
      'indexOfLastItem:',
      indexOfLastItem,
      'currentPage :',
      currentPage,
      'currentSetId : ',
      currentSetId
    );

    setCurrentItems(archivedSets.slice(indexOfFirstItem, indexOfLastItem));
  }, [archivedSets, currentPage]);

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
        async () => {
          const itemToDelete = archiveItemRefs.current[id];

          const tl = GSAP.timeline({
            onStart: () => {
              setIsWaiting(true);
            },
            onComplete: () => {
              const deleteFlow = async () => {
                try {
                  console.log('deleting');

                  await deleteArchivedSet(id);

                  console.log('deleted');

                  const newTotalPages = Math.ceil((archivedSets.length - 1) / ITEMS_PER_PAGE);

                  if (currentPage > newTotalPages) {
                    setCurrentPage(newTotalPages);
                  }
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsWaiting(false);
                }
              };
              deleteFlow();
            },
          });

          tl.to(itemToDelete, {
            scaleY: 0.01,
            duration: 0.2,
          });

          tl.to(itemToDelete, {
            scaleX: 0.01,
            duration: 0.2,
          });

          closeConfirmation();
        },
        {
          main: '削除しますか？',
          sub: '削除した記録は元に戻せません。',
        }
      );
    },
    [deleteArchivedSet, openConfirmation, closeConfirmation, archivedSets]
  );

  const handleLoad = useCallback(
    (id: number) => {
      openConfirmation(
        async () => {
          if (currentSetId || isHistoryChanged) {
            try {
              setIsWaiting(true);
              const titleToUse = localTitle.trim() || '無題';

              if (currentSetId) {
                await updateArchivedSet(currentSetId, titleToUse);
              } else {
                await archiveCurrentSet(titleToUse);
              }
            } catch (err) {
              console.error(err);
            } finally {
              setIsWaiting(false);
            }
          }

          loadArchivedSet(id);
          closeConfirmation();

          router.push('/editor');
        },
        {
          main: 'データを読み込みますか？',
          sub: '編集中の内容は記録されます。',
        }
      );
    },
    [loadArchivedSet, openConfirmation, closeConfirmation, router]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
            {currentItems.map((item, index) => {
              const isCurrent = item.id === editorStore.currentSetId;

              return (
                <ArchiveItem
                  ref={(el) => {
                    archiveItemRefs.current[item.id] = el;
                  }}
                  key={`archive-item-${item.id}`}
                  onClick={() => handleLoad(item.id)}
                  isCurrent={isCurrent}
                  item={item}
                  handleDelete={handleDelete}
                />
              );
            })}
          </div>
          <div className="archive__pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        <footer className="archive__footer">
          <ButtonFooter />
        </footer>
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
