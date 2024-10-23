'use client';

import '@/app/editor/styles/editor.scss';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useSnapshot } from 'valtio';

import { Button } from '@/components/Editor/Button/Button';
import { ButtonFooter } from '@/components/Editor/ButtonFooter/ButtonFooter';
import { ColorPicker } from '@/components/Editor/ColorPicker/ColorPicker';
import { Explanation } from '@/components/Editor/Explanation/Explanation';
import { Grid } from '@/components/Editor/Grid/Grid';
import { VirtualGrid } from '@/components/Editor/VirtualGrid/VirtualGrid';
import { WindowSave } from '@/components/Editor/WindowSave/WindowSave';
import { actions, editorStore } from '@/store/editorStore';

export default function EditorAndVirtualGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { isColorPickerOpen } = useSnapshot(editorStore);
  const [activeExplanation, setActiveExplanation] = useState(1);
  const { closeColorPicker } = actions;

  /**
   * fecthingの際に同等の動作を行うように変更したので、削除予定。 2024/10/21
   *    */
  // useEffect(() => {
  //   const savedState = localStorage.getItem('editorStore');

  //   if (savedState) {
  //     try {
  //       const parsedState = JSON.parse(savedState);
  //       if (parsedState.cellColors && Array.isArray(parsedState.cellColors)) {
  //         editorStore.cellColors = parsedState.cellColors;
  //         editorStore.tempCellColors = parsedState.cellColors;
  //       }
  //       if (parsedState.history && Array.isArray(parsedState.history)) {
  //         editorStore.history = parsedState.history;
  //       }
  //       if (typeof parsedState.historyIndex === 'number') {
  //         editorStore.historyIndex = parsedState.historyIndex;
  //       }
  //       if (typeof parsedState.canUndo === 'boolean') {
  //         editorStore.canUndo = parsedState.canUndo;
  //       }
  //       if (typeof parsedState.canRedo === 'boolean') {
  //         editorStore.canRedo = parsedState.canRedo;
  //       }
  //       console.log('Loaded saved state:', parsedState);

  //     } catch (error) {
  //       console.error('Failed to parse saved state:', error);
  //     }
  //   }
  // }, []);

  const [isWindowSaveOpen, setIsWindowSaveOpen] = useState(false);

  const handleExplanationClick = () => {
    setActiveExplanation((prev) => (prev % 4) + 1);
  };

  const handleWindowSaveClick = () => {
    setIsWindowSaveOpen((prev) => !prev);
  };

  const handleEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isColorPickerOpen) {
          closeColorPicker();
        }
        if (isWindowSaveOpen) {
          setIsWindowSaveOpen(false);
        }
      }
    },
    [isColorPickerOpen, isWindowSaveOpen, closeColorPicker]
  );
  useEffect(() => {
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [handleEscKey]);

  return (
    <>
      <Editor
        gridRef={gridRef}
        isColorPickerOpen={isColorPickerOpen}
        activeExplanation={activeExplanation}
        // setActiveExplanation={setActiveExplanation}
        handleExplanationClick={handleExplanationClick}
        handleWindowSaveClick={handleWindowSaveClick}
        isWindowSaveOpen={isWindowSaveOpen}
        closeColorPicker={closeColorPicker}
      />
      <VirtualGrid gridRef={gridRef} activeExplanation={activeExplanation} />
    </>
  );
}

interface EditorProps {
  gridRef: React.RefObject<HTMLDivElement>;
  isColorPickerOpen: boolean;
  activeExplanation: number;
  // setActiveExplanation: React.Dispatch<React.SetStateAction<number>>;
  closeColorPicker: () => void;
  handleExplanationClick: () => void;
  handleWindowSaveClick: () => void;
  isWindowSaveOpen: boolean;
}

const Editor = ({
  gridRef,
  isColorPickerOpen,
  activeExplanation,
  handleExplanationClick,
  handleWindowSaveClick,
  // setActiveExplanation,
  closeColorPicker,
  isWindowSaveOpen,
}: EditorProps) => {
  const { canUndo, canRedo } = useSnapshot(editorStore);

  return (
    <main className="editor">
      <h2 className="reader-only">editor</h2>
      <div className="editor__inner">
        <div className="editor__grid">
          <div ref={gridRef}>
            <Grid />
          </div>
          <div className={`editor__buttons ${isColorPickerOpen ? 'is-disabled' : ''}`}>
            <Button indicate="left" disabled={!canUndo} />
            <Button indicate="right" disabled={!canRedo} />
          </div>
        </div>
        <div className="editor__ui-space">
          <div className="editor__explanation">
            <Explanation
              text="Select a cell from grid"
              number={1}
              isActive={activeExplanation === 1}
              onClick={handleExplanationClick}
            />
            <Explanation
              text="Choose color"
              number={2}
              isActive={activeExplanation === 2}
              onClick={handleExplanationClick}
            />
            <Explanation
              text="Modify information"
              number={3}
              isActive={activeExplanation === 3}
              onClick={handleExplanationClick}
            />
            <Explanation
              text="To your satisfaction"
              number={4}
              isActive={activeExplanation === 4}
              onClick={handleExplanationClick}
            />
          </div>
        </div>
        <footer className="editor__footer">
          <ButtonFooter />
        </footer>
      </div>
      {/* save */}
      <div className="editor__save">
        <WindowSave onClick={handleWindowSaveClick} isOpen={isWindowSaveOpen} />
      </div>
      {/* colorpicker */}
      <div className="editor__colorpicker">
        <ColorPicker onClose={closeColorPicker} isOpen={isColorPickerOpen} />
      </div>
    </main>
  );
};
