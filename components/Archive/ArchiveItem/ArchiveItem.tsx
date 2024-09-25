import '@/components/Archive/ArchiveItem/styles/archive-item.scss';
import '@/components/Archive/ArchiveItem/styles/button-archive.scss';

import GSAP from 'gsap';
import { forwardRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

interface ArchiveItemProps {
  onClick: () => void;
  handleDelete: (e: React.MouseEvent, id: number) => void;
  isCurrent: boolean;
  item: {
    id: number;
    title: string;
    modifiedAt: Date;
    cellColors: any;
  };
}

export const ArchiveItem = forwardRef<HTMLDivElement, ArchiveItemProps>(
  ({ onClick, handleDelete, isCurrent, item }, ref) => {
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

    const handleClick = () => {
      router.push('/editor');
    };

    return (
      <div
        ref={ref}
        className={`archive-item ${isCurrent ? 'archive-item--current' : ''}`}
        onClick={isCurrent ? handleClick : onClick}
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
            <div className="archive-item__row archive-item__row--date">
              <div className="archive-item__title  _en">Date</div>
              <div className="archive-item__content _en">{formatDate(item.modifiedAt)}</div>
            </div>
          </div>
          <div className="archive-item__buttons">
            <div className="archive-item__icon">
              {isCurrent ? null : (
                <IconColor
                  colorTop={item.cellColors[14].square}
                  colorMiddle1={item.cellColors[15].square}
                  colorMiddle2={item.cellColors[20].square}
                  colorBottom={item.cellColors[21].square}
                />
              )}
            </div>
            <div className="archive-item__edit">
              <ButtonArchive
                onClick={(e: React.MouseEvent) => {
                  handleDelete(e, item.id);
                }}
                isCurrent={isCurrent}
              />
            </div>
          </div>
        </div>
        <div className={`archive-item__corner ${isCurrent ? 'archive-item__corner--current' : ''}`}>
          <Corner />
        </div>
        <div
          className={`_en ${isCurrent ? 'archive-item__indication archive-item__indication--current' : 'archive-item__indication archive-item__indication--editting'}`}
        >
          {isCurrent ? <EdittingText /> : 'Import ->'}
        </div>
        <div className="archive-item__indication archive-item__indication--delete _en">
          Delete
        </div>
      </div>
    );
  }
);

interface ButtonArchiveProps {
  onClick: (e: React.MouseEvent) => void;
  isCurrent: boolean;
}
const ButtonArchive = ({ onClick, isCurrent }: ButtonArchiveProps) => {
  return (
    <div
      className={`button-archive ${isCurrent ? 'button-archive--editting' : 'button-archive--delete'}`}
      onClick={onClick}
    >
      {isCurrent ? <IconEditting /> : <IconDelete />}
    </div>
  );
};

const IconDelete = () => {
  return (
    <svg width={24} height={24} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#f44336"
        d="M352 192V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64H96a32 32 0 0 1 0-64h256zm64 0h192v-64H416v64zM192 960a32 32 0 0 1-32-32V256h704v672a32 32 0 0 1-32 32H192zm224-192a32 32 0 0 0 32-32V416a32 32 0 0 0-64 0v320a32 32 0 0 0 32 32zm192 0a32 32 0 0 0 32-32V416a32 32 0 0 0-64 0v320a32 32 0 0 0 32 32z"
      />
    </svg>
  );
};

interface IconEdittingProps {
  color?: string;
}
const IconEditting = ({ color = '#a1a1a1' }: IconEdittingProps) => {
  return (
    <svg width={24} height={24} viewBox="0 0 330.31 335.31" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          points="168.73 97.36 0 266.1 0 330.31 64.22 330.31 232.95 161.58 168.73 97.36"
          fill={color}
        />
        <rect
          x="231.15"
          y="14.48"
          width="78.56"
          height="90.82"
          transform="translate(36.86 208.76) rotate(-45)"
          fill={color}
        />
        <rect x="289.1" y="294.1" width="41.21" height="41.21" rx="8.36" ry="8.36" fill={color} />
        <rect x="232.8" y="294.1" width="41.21" height="41.21" rx="8.36" ry="8.36" fill={color} />
        <rect x="175.68" y="294.1" width="41.21" height="41.21" rx="8.36" ry="8.36" fill={color} />
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

const EdittingText = () => {
  return (
    <div className="archive-item__indication-text">
      Editting
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </div>
  );
};
