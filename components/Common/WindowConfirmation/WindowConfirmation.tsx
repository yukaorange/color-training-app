import '@/components/Common/WindowConfirmation/styles/window-confirmation.scss';
import '@/components/Common/WindowConfirmation/styles/overlay-confirm.scss';
import '@/components/Common/WindowConfirmation/styles/button-confirm.scss';

interface WindowConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  subMessage: string; 
}

export const WindowConfirmation = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
  subMessage,
}: WindowConfirmationProps) => {
  return (
    <>
      <div
        className={`window-confirmation ${isOpen ? 'window-confirmation--is-open' : 'window-confirmation--is-close'}`}
      >
        <div className="window-confirmation__inner">
          <div className="window-confirmation__header">
            <div className="window-confirmation__caution">
              <div className="window-confirmation__icon-caution">
                <IconCaution />
              </div>
              <p className="window-confirmation__text-caution">{message}</p>
            </div>
            <p className="window-confirmation__text">{subMessage}</p>
          </div>
          <div className="window-confirmation__buttons">
            <button className="button-confirm button-confirm--no _en" onClick={onCancel}>
              No
            </button>
            <button className="button-confirm button-confirm--yes _en" onClick={onConfirm}>
              Yes
            </button>
          </div>
          <div className="window-setting__close">
            <ButtonClose onClick={onCancel} />
          </div>
          <div className="window-confirmation__corner">
            <Corner />
          </div>
        </div>
      </div>
      <div
        className={`overlay-confirm ${isOpen ? 'overlay-confirm--is-open' : 'overlay-confirm--is-close'}`}
        onClick={onCancel}
      ></div>
    </>
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
      <g id="_レイヤー_1-2" data-name="レイヤー_1">
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

const IconCaution = () => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="icon-caution"
    >
      <g id="Vector">
        <path
          d="M18.1557 0.5H13.3435H10.657H5.84531L0 6.34428V11.157V13.843V18.6558L5.84531 24.5H10.657H13.3435H18.1558L24 18.6557V13.843V11.157V6.34428L18.1557 0.5ZM13.468 19.234H10.5325V16.4713H13.468V19.234ZM13.468 14.3997H10.5325V5.76603H13.468V14.3997Z"
          fill="#E0FF1F"
        />
        <path d="M13.468 14.3997H10.5325V5.76603H13.468V14.3997Z" fill="#0D0D0D" />
        <path d="M13.468 19.234H10.5325V16.4713H13.468V19.234Z" fill="#0D0D0D" />
      </g>
    </svg>
  );
};
