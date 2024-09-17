import { proxy } from 'valtio';

interface CellColors {
  square: string;
  circle: string;
}

interface HistoryEntry {
  cellColors: CellColors[];
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

    editorStore.history = [
      ...editorStore.history.slice(0, editorStore.historyIndex + 1),
      { cellColors: editorStore.cellColors },
    ]; // indexまでのhistoryを並べ、その後に新しいhistoryを追加（更新のアルゴリズム）

    editorStore.historyIndex++;

    editorStore.canUndo = true;
    editorStore.canRedo = false;
  },
  openColorPicker: () => {
    editorStore.isColorPickerOpen = true;
    editorStore.tempCellColors = [...editorStore.cellColors];
    actions.updateChangedFlag()
  },
  closeColorPicker: () => {
    editorStore.isColorPickerOpen = false;
    editorStore.tempCellColors = [...editorStore.cellColors];
    editorStore.activeCell = null;
  },
  updateChangedFlag: () => {
    editorStore.isChanged = editorStore.tempCellColors.some(
      (cellColor, index) =>
        cellColor.square !== editorStore.cellColors[index].square ||
        cellColor.circle !== editorStore.cellColors[index].circle
    );

    console.log(editorStore.isChanged);
  },
  undo: () => {
    if (editorStore.historyIndex >= 0) {
      editorStore.historyIndex--;
      editorStore.cellColors =
        editorStore.historyIndex === -1
          ? [...editorStore.initialCellColors]
          : [...editorStore.history[editorStore.historyIndex].cellColors];

      editorStore.tempCellColors = [...editorStore.cellColors];

      editorStore.canUndo = editorStore.historyIndex > -1;
      editorStore.canRedo = true;
    }
  },
  redo: () => {
    if (editorStore.historyIndex < editorStore.history.length - 1) {
      editorStore.historyIndex++;
      editorStore.cellColors = [...editorStore.history[editorStore.historyIndex].cellColors];

      editorStore.tempCellColors = [...editorStore.cellColors];

      editorStore.canUndo = true;
      editorStore.canRedo = editorStore.historyIndex < editorStore.history.length - 1;
    }
  },
  resetToInitial: () => {
    editorStore.cellColors = [...editorStore.initialCellColors];
    editorStore.history = [];
    editorStore.historyIndex = -1;
  },
};
