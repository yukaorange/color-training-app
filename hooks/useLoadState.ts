import { useEffect } from 'react';

import { editorStore, initialCellColors } from '@/store/editorStore';

const isValidColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

export function useLoadState() {
  useEffect(() => {
    const savedState = localStorage.getItem('editorStore');

    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);

        if (Array.isArray(parsedState.cellColors)) {
          parsedState.cellColors = parsedState.cellColors.map((cell: any) => ({
            square: isValidColor(cell.square) ? cell.square : initialCellColors.square,
            circle: isValidColor(cell.circle) ? cell.circle : initialCellColors.circle,
          }));
        }

        if (Array.isArray(parsedState.archivedSets)) {
          parsedState.archivedSets = parsedState.archivedSets.map((set: any) => ({
            ...set,
            cellColors: set.cellColors.map((cell: any) => ({
              square: isValidColor(cell.square) ? cell.square : initialCellColors.square,
              circle: isValidColor(cell.circle) ? cell.circle : initialCellColors.circle,
            })),
            createdAt: new Date(set.createdAt),
            modifiedAt: new Date(set.modifiedAt),
          }));
        }

        Object.assign(editorStore, parsedState);
      } catch (error) {
        console.error('Failed to parse saved state', error);
      }
    }
  }, []);
}
