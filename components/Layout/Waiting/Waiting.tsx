import '@/components/Layout/Waiting/styles/waiting.scss';

export const Waiting = () => {
  return (
    <>
      <div className="waiting">
        <div className="waiting__text _en">
          <div>
            Now Loading
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      </div>
      <div className="waiting-overlay"></div>
    </>
  );
};
