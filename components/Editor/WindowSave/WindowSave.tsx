'use client';

import '@/components/Editor/WindowSave/styles/window-save.scss';
import '@/components/Editor/WindowSave/styles/toggle-window-save.scss';
import '@/components/Editor/WindowSave/styles/project.scss';
import '@/components/Editor/WindowSave/styles/button-save.scss';

import { useState, useEffect, useCallback, KeyboardEvent, useRef } from 'react';
import { useSnapshot } from 'valtio';

import { Marquee } from '@/components/Editor/Marquee/Marquee';
import { editorStore, actions } from '@/store/editorStore';
import { waitingActions } from '@/store/waitingStore';

interface WindowSaveProps {
  onClick: () => void;
  isOpen: boolean;
}

export const WindowSave = ({ onClick, isOpen }: WindowSaveProps) => {
  const {
    currentSetId,
    lastArchivedId,
    archivedSets,
    isColorChanged,
    isHistoryChanged,
    localTitle,
  } = useSnapshot(editorStore);
  const { archiveCurrentSet, updateArchivedSet, setCurrentSetId, setLocalTitle } = actions;
  const { setIsWaiting } = waitingActions;
  const [inputValue, setInputValue] = useState(localTitle);
  const [showAlert, setShowAlert] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setInputValue(localTitle);
  }, [localTitle]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    if (newValue.length <= 20) {
      setInputValue(e.target.value);
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };

  const handleTitleBlur = () => {
    setLocalTitle(inputValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTitleBlur();
      if (!isButtonDisabled()) {
        handleSaveOrUpdate();
      }
    }
  };

  const isButtonDisabled = () => {
    return (
      (!currentSetId && !inputValue.trim()) ||
      ((!isChanged && currentSetId) as boolean) ||
      showAlert ||
      inputValue === ''
    );
  };

  const handleSaveOrUpdate = useCallback(async () => {
    if (localTitle.trim()) {
      try {
        setIsWaiting(true);

        if (currentSetId) {
          await updateArchivedSet(currentSetId, localTitle.trim());
        } else {
          const newId = (await archiveCurrentSet(localTitle.trim())) as number;
          setCurrentSetId(newId);
        }
        onClick();
      } catch (err) {
        console.error(err);
      } finally {
        setIsWaiting(false);
      }
    }
  }, [currentSetId, localTitle, updateArchivedSet, archiveCurrentSet, setCurrentSetId, onClick]);

  const isChanged =
    isHistoryChanged ||
    isColorChanged ||
    (currentSetId && localTitle !== archivedSets.find((set) => set.id === currentSetId)?.title);

  // console.log(
  //   'currentSetID:',
  //   currentSetId,
  //   '\n',
  //   'isHistoryChanged:',
  //   isHistoryChanged,
  //   '\n',
  //   'isColorChanged:',
  //   isColorChanged,
  //   '\n',
  //   'localTitle:',
  //   localTitle,
  //   '\n',
  //   'archivedSets:',
  //   archivedSets,
  //   '\n',
  //   'isChanged:',
  //   isChanged
  // );

  const getButtonText = () => {
    if (!currentSetId) return 'Archive';
    return isChanged ? 'Update' : 'Saved';
  };

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

  const ButtonSaveOrUpdate = () => {
    const buttonText = getButtonText();

    const isDisabled =
      (!currentSetId && !localTitle.trim()) || //編集対象がセットされていない&タイトルが書かれていない
      ((!isChanged && currentSetId) as boolean) || //編集対象がセットされているが、変更がない
      showAlert || //バリデーションエラー
      localTitle == ''; //タイトルが空になっている

    return (
      <button
        ref={buttonRef}
        className={`button-save ${isDisabled ? 'button-save--disabled' : ''}`}
        onClick={isDisabled ? undefined : handleSaveOrUpdate}
        disabled={isDisabled}
      >
        <div className="button-save__text _en">{buttonText}</div>
      </button>
    );
  };

  const nextArchivedIdToDisplay = (lastArchivedId + 1).toString().padStart(6, '0');

  const currentSetIdToDisplay = currentSetId?.toString().padStart(6, '0');

  return (
    <>
      <div
        className={`window-save ${isOpen && 'window-save--is-open'} ${showAlert && 'window-save--alert'}`}
      >
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
              <div className="project__content _en">
                {currentSetIdToDisplay || nextArchivedIdToDisplay}
              </div>
            </div>
            <div className="project__row">
              <label htmlFor="titleInput" className="project__label _en">
                Title
              </label>
              <textarea
                id="titleInput"
                ref={textareaRef}
                className="project__content"
                placeholder={localTitle == '' ? 'you could edit title under 20 chars here!' : localTitle}
                value={inputValue}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleKeyDown}
                // rows={1}
              />
            </div>
            <div className="project__row">
              <div className="project__label _en">Date</div>
              <div className="project__daproject__content _en">
                {new Date().toISOString().split('T')[0]}
              </div>
            </div>
          </div>
          <ButtonSaveOrUpdate />
        </div>
        <div className="window-save__corner">
          <Corner />
        </div>
        <div className="window-save__marquee">
          <Marquee number={1} />
          <Marquee number={2} />
        </div>
        {showAlert && (
          <>
            <div className="window-save__alert _en">Keep under 20</div>
          </>
        )}
      </div>
      <div
        className={`window-save__overlay ${isOpen ? 'window-save__overlay--is-open' : ''}`}
        onClick={onClick}
      ></div>
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
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0V40L40 0H0Z" fill="#5f5f5f" />
    </svg>
  );
};
