import '@/components/Layout/Loading/styles/loading.scss';
import '@/components/Layout/Loading/styles/loading-overlay.scss';
import { forwardRef } from 'react';

export const Loading = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="loading">
      <div className="loading-icon">
        <div className="loading-icon__inner">
          <div className="loading-icon__frame">
            <div className="loading-icon__bar">
              <LoadingBar />
            </div>
            <div className="loading-icon__bar">
              <LoadingBar />
            </div>
          </div>
        </div>
      </div>
      <div className="loading-overlay"></div>
    </div>
  );
});

const LoadingBar = ({ width = 418.4, height = 37.75, fillColor = '#0d0d0d', className = '' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 418.4 37.75"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g>
        <g fill="none">
          <polygon points="174.59 0 143.14 37.75 155.72 37.75 187.18 0 174.59 0" />
          <polygon points="240.66 0 209.2 37.75 221.78 37.75 253.24 0 240.66 0" />
          <polygon points="196.61 0 165.16 37.75 177.74 37.75 209.2 0 196.61 0" />
          <polygon points="152.57 0 121.11 37.75 133.7 37.75 165.16 0 152.57 0" />
          <polygon points="262.68 0 231.22 37.75 243.8 37.75 275.26 0 262.68 0" />
          <polygon points="130.55 0 99.09 37.75 111.68 37.75 143.14 0 130.55 0" />
          <polygon points="218.64 0 187.18 37.75 199.76 37.75 231.22 0 218.64 0" />
          <polygon points="108.53 0 77.07 37.75 89.66 37.75 121.11 0 108.53 0" />
          <polygon points="0 0 0 13.21 11.01 0 0 0" />
          <polygon points="42.47 0 11.01 37.75 23.59 37.75 55.05 0 42.47 0" />
          <polygon points="20.45 0 0 24.54 0 37.75 1.57 37.75 33.03 0 20.45 0" />
          <polygon points="64.49 0 33.03 37.75 45.61 37.75 77.07 0 64.49 0" />
          <polygon points="86.51 0 55.05 37.75 67.64 37.75 99.09 0 86.51 0" />
          <polygon points="306.72 0 275.26 37.75 287.84 37.75 319.3 0 306.72 0" />
          <polygon points="418.4 0 416.82 0 385.36 37.75 397.95 37.75 418.4 13.21 418.4 0" />
          <polygon points="328.74 0 297.28 37.75 309.86 37.75 341.32 0 328.74 0" />
          <polygon points="350.76 0 319.3 37.75 331.89 37.75 363.34 0 350.76 0" />
          <polygon points="372.78 0 341.32 37.75 353.91 37.75 385.36 0 372.78 0" />
          <polygon points="407.39 37.75 418.4 37.75 418.4 24.54 407.39 37.75" />
          <polygon points="394.8 0 363.34 37.75 375.93 37.75 407.39 0 394.8 0" />
          <polygon points="284.7 0 253.24 37.75 265.82 37.75 297.28 0 284.7 0" />
        </g>
        <g fill={fillColor}>
          <polygon points="33.03 0 1.57 37.75 11.01 37.75 42.47 0 33.03 0" />
          <polygon points="11.01 0 0 13.21 0 24.54 20.45 0 11.01 0" />
          <polygon points="99.09 0 67.64 37.75 77.07 37.75 108.53 0 99.09 0" />
          <polygon points="55.05 0 23.59 37.75 33.03 37.75 64.49 0 55.05 0" />
          <polygon points="77.07 0 45.61 37.75 55.05 37.75 86.51 0 77.07 0" />
          <polygon points="143.14 0 111.68 37.75 121.11 37.75 152.57 0 143.14 0" />
          <polygon points="121.11 0 89.66 37.75 99.09 37.75 130.55 0 121.11 0" />
          <polygon points="209.2 0 177.74 37.75 187.18 37.75 218.64 0 209.2 0" />
          <polygon points="165.16 0 133.7 37.75 143.14 37.75 174.59 0 165.16 0" />
          <polygon points="187.18 0 155.72 37.75 165.16 37.75 196.61 0 187.18 0" />
          <polygon points="253.24 0 221.78 37.75 231.22 37.75 262.68 0 253.24 0" />
          <polygon points="231.22 0 199.76 37.75 209.2 37.75 240.66 0 231.22 0" />
          <polygon points="319.3 0 287.84 37.75 297.28 37.75 328.74 0 319.3 0" />
          <polygon points="275.26 0 243.8 37.75 253.24 37.75 284.7 0 275.26 0" />
          <polygon points="297.28 0 265.82 37.75 275.26 37.75 306.72 0 297.28 0" />
          <polygon points="363.34 0 331.89 37.75 341.32 37.75 372.78 0 363.34 0" />
          <polygon points="341.32 0 309.86 37.75 319.3 37.75 350.76 0 341.32 0" />
          <polygon points="418.4 13.21 397.95 37.75 407.39 37.75 418.4 24.54 418.4 13.21" />
          <polygon points="385.36 0 353.91 37.75 363.34 37.75 394.8 0 385.36 0" />
          <polygon points="407.39 0 375.93 37.75 385.36 37.75 416.82 0 407.39 0" />
        </g>
      </g>
    </svg>
  );
};

Loading.displayName = 'Loading';
