import '@/components/Archive/Pagination/styles/pagination.scss';
import '@/components/Archive/Pagination/styles/button-pagination.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePrevious = () => {
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
  };

  const leftDisabled = currentPage === 1 || totalPages === 0;
  const rightDisabled = currentPage === totalPages;

  return (
    <nav className="pagination" aria-label="pagination">
      <div className={`pagination__button`}>
        <ButtonLeft disabled={leftDisabled} onClick={handlePrevious} />
      </div>
      <div className="pagination__indicator _en">
        {currentPage.toString().padStart(2, '0')}/{totalPages.toString().padStart(2, '0')}
      </div>
      <div className={`pagination__button`}>
        <ButtonRight disabled={rightDisabled} onClick={handleNext} />
      </div>
    </nav>
  );
};

interface ButtonProps {
  disabled: boolean;
  onClick: () => void;
}

const ButtonLeft = ({ disabled, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`button-pagination button-pagination--left ${disabled && 'button-pagination--disabled'}`}
    >
      <svg
        width="47"
        height="27"
        viewBox="0 0 47 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-8"
      >
        <g clipPath="url(#clip0_43_5509)">
          <path d="M33.5714 13.5L47 27L47 0L33.5714 13.5Z" fill="black" />
          <path d="M16.7858 13.5L30.2144 27L30.2144 0L16.7858 13.5Z" fill="black" />
          <path d="M-0.000104904 13.5L13.4285 27L13.4285 0L-0.000104904 13.5Z" fill="black" />
        </g>
        <defs>
          <clipPath id="clip0_43_5509">
            <rect width="47" height="27" fill="white" transform="translate(-0.000244141)" />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
};

const ButtonRight = ({ disabled, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`button-pagination button-pagination--right ${
        disabled && 'button-pagination--disabled'
      }`}
    >
      <svg
        width="47"
        height="27"
        viewBox="0 0 47 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_41_2342)">
          <path d="M13.4286 13.5L0 0V27L13.4286 13.5Z" fill="black" />
          <path d="M30.2142 13.5L16.7856 0V27L30.2142 13.5Z" fill="black" />
          <path d="M47.0001 13.5L33.5715 0V27L47.0001 13.5Z" fill="black" />
        </g>
        <defs>
          <clipPath id="clip0_41_2342">
            <rect width="47" height="27" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
};
