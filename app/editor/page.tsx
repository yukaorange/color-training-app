'use client';

import '@/app/editor/styles/editor.scss';

import { Button } from '@/components/Editor/Button/Button';
import { Grid } from '@/components/Editor/Grid/Grid';
import { Explanation } from '@/components/Editor/Explanation/Explanation';
import { ButtonFooter } from '@/components/Editor/ButtonFooter/ButtonFooter';
import { WindowSave } from '@/components/Editor/WindowSave/WindowSave';
import { ColorPicker } from '@/components/Editor/ColorPicker/ColorPicker';
import { VirtualGrid } from '@/components/Editor/VirtualGrid/VirtualGrid';
import { actions, editorStore } from '@/store/editorStore';

import { useRef, useState, useCallback } from 'react';
import { useSnapshot } from 'valtio';

export default function EditorAndVirtualGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { isColorPickerOpen } = useSnapshot(editorStore);

  return (
    <>
      <Editor gridRef={gridRef} isColorPickerOpen={isColorPickerOpen} />
      <VirtualGrid gridRef={gridRef} />
    </>
  );
}

interface EditorProps {
  gridRef: React.RefObject<HTMLDivElement>;

  isColorPickerOpen: boolean;
}

const Editor = ({ gridRef, isColorPickerOpen }: EditorProps) => {
  const { canUndo, canRedo } = useSnapshot(editorStore);
  const { closeColorPicker } = actions;
  const [activeExplanation, setActiveExplanation] = useState(1);
  const [isWindowSaveOpen, setIsWindowSaveOpen] = useState(false);

  const handleExplanationClick = () => {
    setActiveExplanation((prev) => (prev % 4) + 1);
  };

  const handleWindowSaveClick = () => {
    setIsWindowSaveOpen((prev) => !prev);
  };

  return (
    <main className="editor">
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
