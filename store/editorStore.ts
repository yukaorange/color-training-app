import { proxy, subscribe } from 'valtio';
import { isEqual } from 'lodash';

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
  history: HistoryEntry[];
  historyIndex: number;
}

interface EditorStore {
  activeCell: number | null;
  isColorPickerOpen: boolean;
  selectedElement: 'circle' | 'square';
  cellColors: CellColors[];
  initialCellColors: CellColors[];
  tempCellColors: CellColors[];
  localTitle: string;
  history: HistoryEntry[];
  historyIndex: number;
  lastArchivedId: number;
  isColorChanged: boolean;
  isHistoryChanged: boolean;
  canUndo: boolean;
  canRedo: boolean;
  archivedSets: ArchivedSet[];
  isLoggedIn: boolean;
  currentSetId: string | null;
}

export const initialCellColors: CellColors = {
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
  localTitle: '',
  history: [],
  historyIndex: 0,
  lastArchivedId: 0,
  isColorChanged: false,
  isHistoryChanged: false,
  canUndo: false,
  canRedo: false,
  archivedSets: [],
  isLoggedIn: false,
  currentSetId: null,
});

const isValidColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

const saveState = () => {
  if (typeof window === 'undefined') return;

  const state = {
    cellColors: editorStore.cellColors,
    history: editorStore.history,
    historyIndex: editorStore.historyIndex,
    canUndo: editorStore.canUndo,
    canRedo: editorStore.canRedo,
    archivedSets: editorStore.archivedSets,
    currentSetId: editorStore.currentSetId,
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
      actions.updateColorChangedFlag();
    }
  },
  setIsColorChanged: (value: boolean) => {
    editorStore.isColorChanged = value;
  },
  updateColorChangedFlag: () => {
    editorStore.isColorChanged = !isEqual(editorStore.cellColors, editorStore.tempCellColors);
  },
  applyColorChange: () => {
    if (!isEqual(editorStore.cellColors, editorStore.tempCellColors)) {
      editorStore.cellColors = [...editorStore.tempCellColors];

      editorStore.history = [
        ...editorStore.history.slice(0, editorStore.historyIndex + 1),
        { cellColors: editorStore.cellColors },
      ];

      editorStore.historyIndex++;

      editorStore.canUndo = true;
      editorStore.canRedo = false;
      editorStore.isColorChanged = false;
      actions.updateHistoryChangedFlag();
    }
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
    editorStore.isColorChanged = editorStore.tempCellColors.some(
      (cellColor, index) =>
        cellColor.square !== editorStore.cellColors[index].square ||
        cellColor.circle !== editorStore.cellColors[index].circle
    );
  },
  undo: () => {
    if (editorStore.historyIndex > 0) {
      editorStore.historyIndex--;
      editorStore.cellColors = [...editorStore.history[editorStore.historyIndex].cellColors];
      editorStore.tempCellColors = [...editorStore.cellColors];

      editorStore.canUndo = editorStore.historyIndex > 0;
      editorStore.canRedo = true;
      editorStore.isColorChanged = false;
      actions.updateColorChangedFlag();
    }
  },
  redo: () => {
    if (editorStore.historyIndex < editorStore.history.length - 1) {
      editorStore.historyIndex++;
      editorStore.cellColors = [...editorStore.history[editorStore.historyIndex].cellColors];
      editorStore.tempCellColors = [...editorStore.cellColors];

      editorStore.canUndo = true;
      editorStore.canRedo = editorStore.historyIndex < editorStore.history.length - 1;
      editorStore.isColorChanged = false;
      actions.updateColorChangedFlag();
    }
  },
  resetToInitial: () => {
    editorStore.cellColors = [...editorStore.initialCellColors];
    editorStore.tempCellColors = [...editorStore.cellColors];
    editorStore.history = [{ cellColors: [...editorStore.cellColors] }];
    editorStore.historyIndex = 0;
    editorStore.canUndo = false;
    editorStore.canRedo = false;
    editorStore.isColorChanged = false;
    editorStore.localTitle = '';
    actions.updateHistoryChangedFlag();
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
    editorStore.history = editorStore.history.slice(0, editorStore.historyIndex + 1);
    editorStore.history.push({ cellColors: newCellColors });
    editorStore.historyIndex++;

    editorStore.canUndo = true;
    editorStore.canRedo = false;
    editorStore.isColorChanged = false;
    actions.updateHistoryChangedFlag();
  },
  setIsHistoryChanged: (value: boolean) => {
    editorStore.isHistoryChanged = true;
  },
  setCurrentSetId: (id: string | null) => {
    editorStore.currentSetId = id;
  },
  setLocalTitle: (title: string) => {
    editorStore.localTitle = title;
  },
  resetLocalTitle: () => {
    editorStore.localTitle = '';
  },
  archiveCurrentSet: (title: string) => {
    editorStore.lastArchivedId++;
    const newId = editorStore.lastArchivedId.toString().padStart(6, '0');

    const newArvhiveSet: ArchivedSet = {
      id: newId,
      title: title,
      cellColors: editorStore.cellColors,
      createdAt: new Date(),
      modifiedAt: new Date(),
      history: editorStore.history,
      historyIndex: editorStore.historyIndex,
    };

    editorStore.archivedSets = [...editorStore.archivedSets, newArvhiveSet];
    editorStore.currentSetId = newId;
    editorStore.isColorChanged = false;
    editorStore.isHistoryChanged = false;
    return newId;
  },
  loadArchivedSet: (id: string) => {
    const archivedSet = editorStore.archivedSets.find((set) => set.id === id);

    if (archivedSet) {
      editorStore.cellColors = [...archivedSet.cellColors];
      editorStore.tempCellColors = [...archivedSet.cellColors];
      editorStore.history = archivedSet.history || [{ cellColors: [...archivedSet.cellColors] }];
      editorStore.historyIndex = archivedSet.historyIndex || 0;
      editorStore.canUndo = editorStore.historyIndex > 0;
      editorStore.canRedo = editorStore.historyIndex < editorStore.history.length - 1;
      editorStore.isColorChanged = false;
      editorStore.isHistoryChanged = false;
      editorStore.currentSetId = archivedSet.id;

      actions.updateHistoryChangedFlag();
    }
  },
  deleteArchivedSet: (id: string) => {
    editorStore.archivedSets = editorStore.archivedSets.filter((set) => {
      return set.id !== id;
    });

    if (editorStore.currentSetId === id) {
      editorStore.currentSetId = null;
    }
  },
  updateArchivedSet: (id: string, title: string) => {
    editorStore.archivedSets = editorStore.archivedSets.map((set) => {
      if (set.id === id) {
        return {
          ...set,
          title: title,
          cellColors: editorStore.cellColors,
          modifiedAt: new Date(),
          history: editorStore.history,
          historyIndex: editorStore.historyIndex,
        };
      }
      return set;
    });
    editorStore.isColorChanged = false;
    editorStore.isHistoryChanged = false;
  },
  setLoggedIn: (idLoggedIn: boolean) => {
    editorStore.isLoggedIn = idLoggedIn;
  },
  updateHistoryChangedFlag: () => {
    editorStore.isHistoryChanged = editorStore.historyIndex !== 0 || editorStore.history.length > 1;
  },
};
