import '@/components/Editor/ColorPicker/styles/color-picker.scss';
import '@/components/Editor/ColorPicker/styles/button-done.scss';
import '@/components/Editor/ColorPicker/styles/toggle-color-picker.scss';
import '@/components/Editor/ColorPicker/styles/toggle-element-picker.scss';

import { hexToHsva } from '@uiw/color-convert';
import Colorful from '@uiw/react-color-colorful';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSnapshot } from 'valtio';

import { Marquee } from '@/components/Editor/Marquee/Marquee';
import { actions, editorStore } from '@/store/editorStore';

interface ColorPickerProps {
  onClose: () => void;
  isOpen: boolean;
}

export const ColorPicker = ({ onClose, isOpen }: ColorPickerProps) => {
  const { selectedElement, activeCell, tempCellColors, isColorChanged } = useSnapshot(editorStore);
  const { setSelectedElement, setTempColor, applyColorChange } = actions;
  const [currentHex, setCurrentHex] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeCell !== null && tempCellColors[activeCell]) {
      setCurrentHex(tempCellColors[activeCell][selectedElement]);
    }
  }, [activeCell, selectedElement, tempCellColors]);

  const hsva = useMemo(() => {
    if (currentHex !== '') {
      return hexToHsva(currentHex);
    }
    return { h: 0, s: 0, v: 0, a: 1 };
  }, [currentHex]);

  const handleColorChange = useCallback(
    (color: { hex: string; hsva: typeof hsva }) => {
      setCurrentHex(color.hex);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setTempColor(color.hex);
      }, 300);
    },
    [setTempColor]
  );

  const handleDoneClick = useCallback(() => {
    applyColorChange();
    onClose();
  }, []);

  return (
    <>
      <div className={`color-picker ${isOpen ? 'color-picker--is-open' : ''}`}>
        <div
          className={`color-picker__toggle ${isOpen ? 'color-picker__toggle--is-open' : ''}`}
          onClick={onClose}
        >
          <ToggleColorPicker isOpen={isOpen} />
        </div>
        <div className="color-picker__inner">
          <div className="color-picker__library">
            <div className="color-picker__element-selector">
              <div className="toggle-element-picker">
                <button
                  onClick={() => setSelectedElement('square')}
                  className={`toggle-element-picker__button toggle-element-picker__button${selectedElement === 'square' ? '--is-active' : '--is-inactive'} _en`}
                >
                  Square
                </button>
                <button
                  onClick={() => setSelectedElement('circle')}
                  className={`toggle-element-picker__button toggle-element-picker__button${selectedElement === 'circle' ? '--is-active' : '--is-inactive'} _en`}
                >
                  Circle
                </button>
                <div className="toggle-element-picker__glider"></div>
              </div>
            </div>
            <div className="color-picker__palette">
              {isOpen && <Colorful color={hsva} onChange={handleColorChange} disableAlpha={true} />}
            </div>
            <div className="color-picker__button _en">
              <button
                className={`button-done ${isColorChanged ? '' : 'button-done--is-disabled'}`}
                onClick={handleDoneClick}
              >
                <span className="button-done__text">done</span>
                <span className="button-done__icon">
                  <Image src="/images/editor/submit-check.svg" alt="" width={15} height={10} />
                </span>
              </button>
            </div>
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
        onClick={onClose}
        aria-hidden={!isOpen}
      ></div>
    </>
  );
};

const ToggleColorPicker = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <>
      <div className={`toggle-color-picker _en ${isOpen && 'toggle-color-picker--is-open'}`}>
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
