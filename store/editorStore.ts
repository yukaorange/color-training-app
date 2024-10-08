import { isEqual } from 'lodash';
import { proxy, subscribe } from 'valtio';

import {
  archiveCurrentSetToStore,
  updateArchivedSetInStore,
  deleteArchivedSetInStore,
} from '@/app/api/crud';

interface CellColors {
  square: string;
  circle: string;
}

interface HistoryEntry {
  cellColors: CellColors[];
}

interface ArchivedSet {
  id: number;
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
  currentSetId: number | null;
  isColorChanged: boolean;
  isHistoryChanged: boolean;
  canUndo: boolean;
  canRedo: boolean;
  archivedSets: ArchivedSet[];
  isLoggedIn: boolean;
}

export const initialCellColors: CellColors = {
  square: '#f5f5f5',
  circle: '#a9a9a9',
};

const initialState: EditorStore = {
  //Editor UI (real time editing)
  isColorPickerOpen: false,
  activeCell: null,
  selectedElement: 'square',
  initialCellColors: Array(36).fill(initialCellColors),
  tempCellColors: Array(36).fill(initialCellColors),
  cellColors: Array(36).fill(initialCellColors),
  isColorChanged: false,
  canUndo: false,
  canRedo: false,
  currentSetId: null,

  //Save / load (data of single set)
  history: [{ cellColors: Array(36).fill(initialCellColors) }],
  historyIndex: 0,
  isHistoryChanged: false,
  localTitle: '',
  lastArchivedId: 0, //本番は0から開始

  //Archive (user archive)
  archivedSets: [],

  //user
  isLoggedIn: false,
};

export const editorStore = proxy<EditorStore>(initialState);

// const isValidColor = (color: string): boolean => {
//   return /^#[0-9A-F]{6}$/i.test(color);
// };

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

      console.log('applyColorChange and comfirm history', editorStore.history);

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

      // editorStore.isColorChanged = false;

      actions.updateColorChangedFlag();
      actions.updateHistoryChangedFlag();
    }
  },
  redo: () => {
    if (editorStore.historyIndex < editorStore.history.length - 1) {
      editorStore.historyIndex++;
      editorStore.cellColors = [...editorStore.history[editorStore.historyIndex].cellColors];
      editorStore.tempCellColors = [...editorStore.cellColors];

      editorStore.canUndo = true;
      editorStore.canRedo = editorStore.historyIndex < editorStore.history.length - 1;

      // editorStore.isColorChanged = false;

      actions.updateColorChangedFlag();
      actions.updateHistoryChangedFlag();
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

    // console.log(
    //   editorStore.cellColors.forEach((color) => {
    //     console.log(color);
    //   })
    // );

    const newCellColors = Array(36)
      .fill(null)
      .map(() => {
        const randomColor = {
          square: generateRandomColor(),
          circle: generateRandomColor(),
        };

        return randomColor;
      });
    // const newCellColors = editorStore.cellColors.map((cellColor, index) => {
    //   const initialColor = editorStore.initialCellColors[index];

    //   return {
    //     square: cellColor.square !== initialColor.square ? cellColor.square : generateRandomColor(),
    //     circle: cellColor.circle !== initialColor.circle ? cellColor.circle : generateRandomColor(),
    //   };
    // });

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
    console.log('setIsHistoryChanged', value);
    editorStore.isHistoryChanged = true;
  },
  setCurrentSetId: (id: number | null) => {
    editorStore.currentSetId = id;
  },
  setLocalTitle: (title: string) => {
    editorStore.localTitle = title;
  },
  resetLocalTitle: () => {
    editorStore.localTitle = '';
  },
  archiveCurrentSet: async (title: string) => {
    try {
      editorStore.lastArchivedId++;
      const newId = editorStore.lastArchivedId;

      const newArvhiveSet: ArchivedSet = {
        id: newId,
        title: title,
        cellColors: editorStore.cellColors,
        createdAt: new Date(),
        modifiedAt: new Date(),
        history:
          editorStore.history.length > 0
            ? editorStore.history
            : [{ cellColors: editorStore.cellColors }],
        historyIndex: editorStore.history.length > 0 ? editorStore.historyIndex : 0,
      };

      editorStore.archivedSets = [...editorStore.archivedSets, newArvhiveSet];
      editorStore.currentSetId = newId;
      editorStore.isColorChanged = false;
      editorStore.isHistoryChanged = false;
      editorStore.localTitle = title;

      await archiveCurrentSetToStore(newArvhiveSet);

      return newId;
    } catch (err) {
      console.error(err);

      editorStore.lastArchivedId--;
      editorStore.archivedSets = editorStore.archivedSets.slice(0, -1);
      editorStore.currentSetId =
        editorStore.archivedSets.length > 0
          ? editorStore.archivedSets[editorStore.archivedSets.length - 1].id
          : null;
    }
  },
  loadArchivedSet: (id: number) => {
    const archivedSet = editorStore.archivedSets.find((set) => set.id === id);

    if (archivedSet) {
      editorStore.history = archivedSet.history || [{ cellColors: [...archivedSet.cellColors] }];
      editorStore.historyIndex = archivedSet.historyIndex || 0;

      // console.log('historyIdex', editorStore.historyIndex, '\n', 'history', editorStore.history);

      const currentHistoryEntry = editorStore.history[editorStore.historyIndex].cellColors;

      editorStore.cellColors = [...currentHistoryEntry];
      editorStore.tempCellColors = [...currentHistoryEntry];

      editorStore.canUndo = editorStore.historyIndex > 0;
      editorStore.canRedo = editorStore.historyIndex < editorStore.history.length - 1;

      // console.log(editorStore.canUndo, editorStore.canRedo, editorStore.historyIndex);

      editorStore.isColorChanged = false;
      editorStore.isHistoryChanged = false;

      editorStore.currentSetId = archivedSet.id;
      editorStore.localTitle = archivedSet.title;
    } else {
      console.error(`アーカイブが見つかりませんでした:No${id}`);
    }
  },
  deleteArchivedSet: async (id: number) => {
    try {
      await deleteArchivedSetInStore(id);

      editorStore.archivedSets = editorStore.archivedSets.filter((set) => {
        return set.id !== id;
      });

      if (editorStore.currentSetId === id) {
        editorStore.currentSetId = null;
        actions.resetToInitial();
      }
    } catch (err) {
      console.error(err);
    }
  },
  updateArchivedSet: async (id: number, title: string) => {
    try {
      const updatedSetIndex = editorStore.archivedSets.findIndex((set) => set.id === id);

      if (updatedSetIndex === -1) {
        throw new Error(`アーカイブが見つかりませんでした:No${id}`);
      }

      const updatedArchivedSet: ArchivedSet = {
        ...editorStore.archivedSets[updatedSetIndex],
        title,
        cellColors: editorStore.cellColors,
        modifiedAt: new Date(),
        history: editorStore.history,
        historyIndex: editorStore.historyIndex,
      };

      await updateArchivedSetInStore(updatedArchivedSet);

      editorStore.archivedSets[updatedSetIndex] = updatedArchivedSet;
      editorStore.isColorChanged = false;
      editorStore.isHistoryChanged = false;
      editorStore.localTitle = title;
    } catch (err) {
      console.error(err);
    }
  },
  setLoggedIn: (idLoggedIn: boolean) => {
    editorStore.isLoggedIn = idLoggedIn;
  },
  updateHistoryChangedFlag: () => {
    editorStore.isHistoryChanged = editorStore.historyIndex !== 0 || editorStore.history.length > 1;
  },
};
