import { proxy, subscribe } from 'valtio';

interface CellColors {
  square: string;
  circle: string;
}

interface HistoryEntry {
  cellColors: CellColors[];
}

interface ArchivedSet {
  id: string;
  title: string;
  cellColors: CellColors[];
  createdAt: Date;
  modifiedAt: Date;
}

interface EditorStore {
  activeCell: number | null;
  isColorPickerOpen: boolean;
  selectedElement: 'circle' | 'square';
  cellColors: CellColors[];
  initialCellColors: CellColors[];
  tempCellColors: CellColors[];
  history: HistoryEntry[];
  historyIndex: number;
  isChanged: boolean;
  canUndo: boolean;
  canRedo: boolean;
  archivedSets: ArchivedSet[];
}

const initialCellColors: CellColors = {
  square: '#f5f5f5',
  circle: '#a9a9a9',
};

export const editorStore = proxy<EditorStore>({
  activeCell: null,
  isColorPickerOpen: false,
  selectedElement: 'square',
  cellColors: Array(36).fill(initialCellColors),
  initialCellColors: Array(36).fill(initialCellColors),
  tempCellColors: Array(36).fill(initialCellColors),
  history: [],
  historyIndex: -1,
  isChanged: false,
  canUndo: false,
  canRedo: false,
  archivedSets: [],
});

const isValidColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

const loadState = () => {
  if (typeof window === 'undefined') return;
  const savedState = localStorage.getItem('editorStore');

  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);

      if (Array.isArray(parsedState.cellColors)) {
        parsedState.cellColors = parsedState.cellColors.map((cell: any) => {
          return {
            square: isValidColor(cell.square) ? cell.square : initialCellColors.square,
            circle: isValidColor(cell.circle) ? cell.circle : initialCellColors.circle,
          };
        });

        return parsedState;
      }

      if (Array.isArray(parsedState.archivedSets)) {
        parsedState.archivedSets = parsedState.archivedSets.map((set: any) => ({
          ...set,
          cellColors: set.cellColors.map((cell: any) => ({
            square: isValidColor(cell.square) ? cell.square : initialCellColors.square,
            circle: isValidColor(cell.circle) ? cell.circle : initialCellColors.circle,
          })),
        }));
      }
    } catch (error) {
      console.error('failded to parse saved state', error);
    }
  }

  return {};
};

const saveState = () => {
  if (typeof window === 'undefined') return;

  const state = {
    cellColors: editorStore.cellColors,
    history: editorStore.history,
    historyIndex: editorStore.historyIndex,
    canUndo: editorStore.canUndo,
    canRedo: editorStore.canRedo,
  };

  localStorage.setItem('editorStore', JSON.stringify(state));
};

subscribe(editorStore, () => {
  saveState();
});

export const actions = {
  setActiveCell: (cell: number | null) => {
    editorStore.activeCell = cell;
  },
  toggleColorPicker: () => {
    editorStore.isColorPickerOpen = !editorStore.isColorPickerOpen;
    if (!editorStore.isColorPickerOpen) {
      editorStore.activeCell = null;
    }
  },
  setSelectedElement: (element: 'square' | 'circle') => {
    editorStore.selectedElement = element;
  },
  setTempColor: (color: string) => {
    if (editorStore.activeCell !== null) {
      const newCellColors = editorStore.tempCellColors.map((cellColor, index) => {
        return index === editorStore.activeCell
          ? { ...cellColor, [editorStore.selectedElement]: color }
          : cellColor;
      });

      editorStore.tempCellColors = newCellColors;
    }
  },
  applyColorChange: () => {
    editorStore.cellColors = [...editorStore.tempCellColors];

    // historyIndexが-1なら新しい履歴を開始
    if (editorStore.historyIndex === -1) {
      editorStore.history = [{ cellColors: editorStore.cellColors }];
      editorStore.historyIndex = 0;
    } else {
      editorStore.history = [
        ...editorStore.history.slice(0, editorStore.historyIndex + 1),
        { cellColors: editorStore.cellColors },
      ];
      editorStore.historyIndex++;
    }

    editorStore.canUndo = true;
    editorStore.canRedo = false;
    editorStore.isChanged = true;
  },
  openColorPicker: () => {
    editorStore.isColorPickerOpen = true;
    editorStore.tempCellColors = [...editorStore.cellColors];
    actions.updateChangedFlag();
  },
  closeColorPicker: () => {
    editorStore.isColorPickerOpen = false;
    editorStore.tempCellColors = [...editorStore.cellColors];
    editorStore.activeCell = null;
    actions.updateChangedFlag();
  },
  updateChangedFlag: () => {
    editorStore.isChanged = editorStore.tempCellColors.some(
      (cellColor, index) =>
        cellColor.square !== editorStore.cellColors[index].square ||
        cellColor.circle !== editorStore.cellColors[index].circle
    );
  },
  undo: () => {
    if (editorStore.historyIndex > -1) {
      editorStore.historyIndex--;
      editorStore.cellColors =
        editorStore.historyIndex === -1
          ? [...editorStore.initialCellColors]
          : [...editorStore.history[editorStore.historyIndex].cellColors];
      editorStore.tempCellColors = [...editorStore.cellColors];

      editorStore.canUndo = editorStore.historyIndex > -1;
      editorStore.canRedo = true;
      editorStore.isChanged = editorStore.historyIndex !== -1;
    }
  },
  redo: () => {
    if (editorStore.historyIndex < editorStore.history.length - 1) {
      editorStore.historyIndex++;
      editorStore.cellColors = [...editorStore.history[editorStore.historyIndex].cellColors];
      editorStore.tempCellColors = [...editorStore.cellColors];

      editorStore.canUndo = true;
      editorStore.canRedo = editorStore.historyIndex < editorStore.history.length - 1;
      editorStore.isChanged = true;
    }
  },
  resetToInitial: () => {
    editorStore.cellColors = [...editorStore.initialCellColors];
    editorStore.tempCellColors = [...editorStore.cellColors];
    editorStore.history = [];
    editorStore.historyIndex = -1;
    editorStore.canUndo = false;
    editorStore.canRedo = false;
    editorStore.isChanged = false;
  },
  generateRandomColors: () => {
    const generateRandomColor = () => {
      return (
        '#' +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0')
      );
    };

    const newCellColors = Array(36)
      .fill(null)
      .map(() => {
        return {
          square: generateRandomColor(),
          circle: generateRandomColor(),
        };
      });

    editorStore.cellColors = newCellColors;
    editorStore.tempCellColors = [...editorStore.cellColors];
    editorStore.history = [{ cellColors: newCellColors }];
    editorStore.historyIndex = 0;
    editorStore.canUndo = true;
    editorStore.canRedo = false;
    editorStore.isChanged = false;
  },
  archiveCurrentSet: (title: string) => {
    const newArvhiveSet: ArchivedSet = {
      id: Date.now().toString(),
      title: title,
      cellColors: editorStore.cellColors,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
  },
  loadArchivedSet: (id: string) => {
    const archivedSet = editorStore.archivedSets.find((set) => {
      return set.id === id;
    });

    if (archivedSet) {
      editorStore.cellColors = [...archivedSet.cellColors];
      editorStore.tempCellColors = [...archivedSet.cellColors];
      editorStore.history = [];
      editorStore.historyIndex = -1;
      editorStore.canUndo = false;
      editorStore.canRedo = false;
      editorStore.isChanged = false;
    }
  },
  deleteArchivedSet: (id: string) => {
    editorStore.archivedSets = editorStore.archivedSets.filter((set) => {
      return set.id !== id;
    });
  },
};
