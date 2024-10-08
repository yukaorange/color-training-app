import '@/components/Layout/SVGFilter/styles/svg-filter.scss';

export const SVGFileter = () => {
  return (
    <div className="svg-filter">
      <svg width="0" height="0">
        <filter id="color-change-filter">
          <animate
            attributeName="color-interpolation-filters"
            values="sRGB; linear-rgb; sRGB"
            dur="5s"
            repeatCount="indefinite"
          />
          <feColorMatrix type="hueRotate" values="0">
            <animate attributeName="values" values="0; 360; 0" dur="8s" repeatCount="indefinite" />
          </feColorMatrix>
        </filter>
        <filter id="color-change-filter-2">
          <animate
            attributeName="color-interpolation-filters"
            values="sRGB; linear-rgb; sRGB"
            dur="5s"
            repeatCount="indefinite"
          />
          <feColorMatrix type="hueRotate" values="0">
            <animate
              attributeName="values"
              values="0; 60; 0; 240; 0; 180; 0;"
              dur="3s"
              repeatCount="indefinite"
            />
          </feColorMatrix>
        </filter>
        <filter id="color-change-filter-3">
          <animate
            attributeName="color-interpolation-filters"
            values="sRGB; linear-rgb; sRGB"
            dur="5s"
            repeatCount="indefinite"
          />
          <feColorMatrix type="hueRotate" values="0">
            <animate
              attributeName="values"
              values="0; 60; 0; 30; 0; 90; 0;"
              dur="3s"
              repeatCount="indefinite"
            />
          </feColorMatrix>
        </filter>
      </svg>
    </div>
  );
};
