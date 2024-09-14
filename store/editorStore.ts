import { proxy } from 'valtio';

interface CellColors {
  square: string;
  circle: string;
}

interface EditorStore {
  activeCell: number | null;
  isColorPickerOpen: boolean;
  selectedElement: 'circle' | 'square';
  cellColors: CellColors[];
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
  setColor: (color: string) => {
    if (editorStore.activeCell !== null) {
      editorStore.cellColors = editorStore.cellColors.map((cellColor, index) =>
        index === editorStore.activeCell
          ? { ...cellColor, [editorStore.selectedElement]: color }
          : cellColor
      );
    }
  },
};
