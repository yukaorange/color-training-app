import '@/components/Editor/Grid/styles/grid.scss';

export const Grid = () => {
  const GRID_SIZE = 6;

  const cells = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      cells.push(
        <div
          key={`${row} - ${col}`}
          style={{
            top: `${(row / GRID_SIZE) * 100}%`,
            left: `${(col / GRID_SIZE) * 100}% `,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
          }}
          className="grid__cell"
          data-ui-name="cell"
        ></div>
      );
    }
  }

  return <div className="grid">{cells}</div>;
};
