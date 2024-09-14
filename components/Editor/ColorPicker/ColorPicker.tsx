import '@/components/Editor/ColorPicker/styles/color-picker.scss';
import '@/components/Editor/ColorPicker/styles/toggle-color-picker.scss';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { actions, editorStore } from '@/store/editorStore';

import Colorful from '@uiw/react-color-colorful';
import { hexToHsva } from '@uiw/color-convert';
import { Marquee } from '@/components/Editor/Marquee/Marquee';

interface ColorPickerProps {
  onClick: () => void;
  isOpen: boolean;
}

export const ColorPicker = ({ onClick, isOpen }: ColorPickerProps) => {
  const { activeCell, selectedElement, cellColors } = useSnapshot(editorStore);
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 0, a: 1 });
  const [currentHex, setCurrentHex] = useState('');
  const { setSelectedElement, setColor } = actions;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeCell !== null && cellColors[activeCell]) {
      const currentColor = cellColors[activeCell][selectedElement];
      setCurrentHex(currentColor);
    }
  }, [selectedElement, activeCell, cellColors]);

  useEffect(() => {
    if (currentHex !== '') {
      const newHsva = hexToHsva(currentHex);
      if (JSON.stringify(newHsva) !== JSON.stringify(hsva)) {
        setHsva(newHsva);
      }
    }
  }, [currentHex, hsva]);

  const handleColorChange = useCallback(
    (color: { hex: string; hsva: typeof hsva }) => {
      setCurrentHex(color.hex);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setColor(color.hex);
      }, 300);
    },
    [activeCell, setColor]
  );

  return (
    <>
      <div className={`color-picker ${isOpen ? 'color-picker--is-open' : ''}`}>
        <div
          className={`color-picker__toggle ${isOpen ? 'color-picker__toggle--is-open' : ''}`}
          onClick={onClick}
        >
          <ToggleColorPicker isOpen={isOpen} />
        </div>
        <div className="color-picker__inner">
          <div className="color-picker__library">
            <div className="color-picker__element-selector">
              <button
                onClick={() => setSelectedElement('square')}
                className={selectedElement === 'square' ? 'active' : ''}
              >
                Square
              </button>
              <button
                onClick={() => setSelectedElement('circle')}
                className={selectedElement === 'circle' ? 'active' : ''}
              >
                Circle
              </button>
            </div>
            <div className="color-picker__palette">
              <Colorful color={hsva} onChange={handleColorChange} disableAlpha={true} />
            </div>
            <button className="color-picker__done-button _en" onClick={onClick}>
              done
            </button>
          </div>
        </div>
        <div className="color-picker__corner">
          <Corner />
        </div>
        <div className="color-picker__marquee">
          <Marquee number={1} />
          <Marquee number={2} />
        </div>
      </div>
      <div
        className={`color-picker-overlay ${isOpen ? 'color-picker-overlay--is-open' : ''}`}
        onClick={onClick}
      ></div>
    </>
  );
};

const ToggleColorPicker = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <>
      <div className="toggle-color-picker _en">
        <div className="toggle-color-picker__text">CLOSE</div>
        <div className="toggle-color-picker__icon">
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
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0V40L40 0H0Z" fill="#5f5f5f" />
    </svg>
  );
};
