// lodashのisEqualは深い比較を行うために使用され、配列やオブジェクトの完全な一致を確認できる優れもの
import { isEqual } from 'lodash';
import { proxy, subscribe } from 'valtio';

// CRUD操作のための関数をインポート
// これらの関数は永続化層(アプリケーションのデータを永続的に保存・管理する層)とのインターフェースを提供
//ユーザーが作成したセットやその履歴を保存
//ブラウザを閉じたり、リロードしても失われないようにする
import {
  archiveCurrentSetToStore,
  updateArchivedSetInStore,
  deleteArchivedSetInStore,
} from '@/app/api/crud';
interface CellColors {
  square: string;
  circle: string;
}

// 履歴エントリーの定義
// Undo/Redo機能のために各時点でのセルの状態を保存
interface HistoryEntry {
  cellColors: CellColors[];
}

// アーカイブされたセットの定義
// ユーザーが保存した完全なエディタの状態を表現
interface ArchivedSet {
  id: number;
  title: string;
  cellColors: CellColors[];
  createdAt: Date;
  modifiedAt: Date;
  history: HistoryEntry[];
  historyIndex: number;
}

// エディタの完全な状態を定義するインターフェース
// ストア設計：
// 1. 状態の3層構造
// - 永続化された状態（archivedSets）
// - 現在の作業状態（cellColors）
// - 一時的な編集状態（tempCellColors）
//
// 2. 各状態の独立
// - UIの状態（isColorPickerOpen等）
// - データの状態（colors, history等）
// - メタ情報（フラグ類）
//
// 3. 最適化のための状態分離
// - 編集中の一時データと確定データの分離
// - 履歴管理のための状態分離
interface EditorStore {
  // UI状態の管理
  activeCell: number | null; // 現在選択中のセル（なければnull）
  isColorPickerOpen: boolean; // カラーピッカーの表示状態
  selectedElement: 'circle' | 'square'; // 現在編集中の要素

  // セルの色情報管理
  cellColors: CellColors[]; // 現在の色情報
  initialCellColors: CellColors[]; // 初期状態の色情報
  tempCellColors: CellColors[]; // 一時的な色情報（プレビュー用）

  // メタデータ
  localTitle: string; // 現在のセットのタイトル

  // 履歴管理
  history: HistoryEntry[];
  historyIndex: number;

  // アーカイブ管理
  lastArchivedId: number; // 最後に使用したアーカイブID
  currentSetId: number | null; // 現在編集中のセットID

  // 状態フラグ
  isColorChanged: boolean; // 色が変更されたかどうか
  isHistoryChanged: boolean; // 履歴が変更されたかどうか
  canUndo: boolean; // Undo可能かどうか
  canRedo: boolean; // Redo可能かどうか

  // データ永続化
  archivedSets: ArchivedSet[]; // 保存された全セット

  // ユーザー状態
  isLoggedIn: boolean; // ログイン状態
}

// 初期カラー設定
export const initialCellColors: CellColors = {
  square: '#f5f5f5',
  circle: '#a9a9a9',
};

// ストアの初期状態を定義
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

  // 履歴管理の初期化
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

// Valtioのproxyを使用してストアを作成
// これにより、状態の変更を自動的に追跡し、コンポーネントの再レンダリングをトリガー
export const editorStore = proxy<EditorStore>(initialState);

// const isValidColor = (color: string): boolean => {
//   return /^#[0-9A-F]{6}$/i.test(color);
// };

// ローカルストレージへの状態保存
// ブラウザのリロード時にも状態を維持するため
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

// ストアの変更を監視し、変更があればローカルストレージに保存
subscribe(editorStore, () => {
  saveState();
});

// アクション定義
// 全てのストア操作をここで一元管理し、一貫性のある状態変更を保証
export const actions = {
  // 色変更の実装戦略：
  // 1. 二段階の状態更新（プレビュー → 確定）
  // 2. パフォーマンス最適化のための更新制御

  // セルの選択状態を設定
  setActiveCell: (cell: number | null) => {
    editorStore.activeCell = cell;
  },
  // カラーピッカーの表示/非表示を切り替え
  toggleColorPicker: () => {
    editorStore.isColorPickerOpen = !editorStore.isColorPickerOpen;
    // ピッカーを閉じる際は選択セルをクリア
    if (!editorStore.isColorPickerOpen) {
      editorStore.activeCell = null;
    }
  },
  // 編集対象の要素（円または四角）を設定
  setSelectedElement: (element: 'square' | 'circle') => {
    editorStore.selectedElement = element;
  },
  // 一時的な色の変更
  // プレビュー目的で、実際の変更は確定されるまで永続化されない
  setTempColor: (color: string) => {
    if (editorStore.activeCell !== null) {
      // スプレッド構文による新しいオブジェクト生成は
      // 必要なセルのみに限定し、パフォーマンスを最適化
      const newCellColors = editorStore.tempCellColors.map((cellColor, index) => {
        // 選択されたセルの、選択された要素（square/circle）のみ更新
        return index === editorStore.activeCell
          ? { ...cellColor, [editorStore.selectedElement]: color }
          : cellColor;
      });
      editorStore.tempCellColors = newCellColors;
      actions.updateColorChangedFlag(); // 変更状態を更新
    }
  },
  // 色変更フラグを直接設定するユーティリティ
  setIsColorChanged: (value: boolean) => {
    editorStore.isColorChanged = value;
  },
  // 現在の色と一時的な色を比較して変更フラグを更新
  // lodashのisEqualで深い比較を行い、正確な変更検知を実現
  updateColorChangedFlag: () => {
    editorStore.isColorChanged = !isEqual(editorStore.cellColors, editorStore.tempCellColors);
  },

  // 履歴管理：
  // 1. スタック型データ構造による管理
  // 2. 現在位置以降の履歴を破棄する設計
  // 3. インデックスベースのナビゲーション

  // 一時的な色変更を確定して履歴に追加
  // Undo/Redo機能のために履歴を管理
  applyColorChange: () => {
    if (!isEqual(editorStore.cellColors, editorStore.tempCellColors)) {
      // 現在の色を更新
      editorStore.cellColors = [...editorStore.tempCellColors];

      // 現在位置より後の履歴を破棄し、新しい状態を追加
      // これにより分岐のない直線的な履歴を維持
      editorStore.history = [
        ...editorStore.history.slice(0, editorStore.historyIndex + 1),
        { cellColors: editorStore.cellColors },
      ];

      console.log('applyColorChange and comfirm history', editorStore.history);

      editorStore.historyIndex++; // 履歴位置を進める

      editorStore.canUndo = true;
      editorStore.canRedo = false;
      editorStore.isColorChanged = false;
      actions.updateHistoryChangedFlag();
    }
  },
  // カラーピッカー関連のUI状態管理
  // カラーピッカーを開く際の初期化処理
  openColorPicker: () => {
    editorStore.isColorPickerOpen = true;
    // 現在の色を一時的な色として複製（キャンセル時の復元用）
    editorStore.tempCellColors = [...editorStore.cellColors];
    actions.updateChangedFlag();
  },
  // カラーピッカーを閉じる際のクリーンアップ
  closeColorPicker: () => {
    editorStore.isColorPickerOpen = false;
    editorStore.tempCellColors = [...editorStore.cellColors];
    // 選択状態をクリア
    editorStore.activeCell = null;
    actions.updateChangedFlag();
  },
  // 変更状態を確認するための詳細な比較
  // 各セルの square と circle の色を個別に比較
  updateChangedFlag: () => {
    //一時的な色（tempCellColors）と
    //現在の色（cellColors）を
    //各セルごとに比較し
    //四角（square）または円（circle）のどちらかでも色が違えば
    //isColorChanged を true にする
    editorStore.isColorChanged = editorStore.tempCellColors.some(
      //some -> 配列の要素が少なくとも1つでも条件を満たす場合に true を返す
      (cellColor, index) =>
        cellColor.square !== editorStore.cellColors[index].square ||
        cellColor.circle !== editorStore.cellColors[index].circle
    );
  },
  // 履歴操作に関するアクション群

  // Undo操作の実装
  // 履歴を1つ前に戻し、その時点の状態を復元
  undo: () => {
    if (editorStore.historyIndex > 0) {
      editorStore.historyIndex--;

      // 履歴から状態を復元
      editorStore.cellColors = [...editorStore.history[editorStore.historyIndex].cellColors];
      editorStore.tempCellColors = [...editorStore.cellColors];

      // Undo/Redoの可用性を更新
      editorStore.canUndo = editorStore.historyIndex > 0;
      editorStore.canRedo = true;

      // editorStore.isColorChanged = false;

      actions.updateColorChangedFlag();
      actions.updateHistoryChangedFlag();
    }
  },

  // Redo操作の実装
  // 履歴を1つ先に進め、その時点の状態を復元
  redo: () => {
    if (editorStore.historyIndex < editorStore.history.length - 1) {
      editorStore.historyIndex++;

      // 履歴から状態を復元
      editorStore.cellColors = [...editorStore.history[editorStore.historyIndex].cellColors];
      editorStore.tempCellColors = [...editorStore.cellColors];

      // Undo/Redoの可用性を更新
      editorStore.canUndo = true;
      editorStore.canRedo = editorStore.historyIndex < editorStore.history.length - 1;

      // editorStore.isColorChanged = false;

      actions.updateColorChangedFlag();
      actions.updateHistoryChangedFlag();
    }
  },

  // エディタの状態を初期状態にリセット
  // 新規作成時やエラー発生時のリカバリーに使用
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
  // ランダムな色生成機能
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

    // 全セルに新しいランダムな色を設定
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

    // 状態を更新し、履歴に追加
    editorStore.cellColors = newCellColors;
    editorStore.tempCellColors = [...editorStore.cellColors];
    editorStore.history = editorStore.history.slice(0, editorStore.historyIndex + 1);
    editorStore.history.push({ cellColors: newCellColors });
    editorStore.historyIndex++;

    // フラグを更新
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

  // アーカイブ管理に関するアクション群
  // 現在の状態をアーカイブとして保存
  archiveCurrentSet: async (title: string) => {
    try {
      // 新しいアーカイブIDを生成
      editorStore.lastArchivedId++;
      const newId = editorStore.lastArchivedId;

      // アーカイブデータを構築
      const newArvhiveSet: ArchivedSet = {
        id: newId,
        title: title,
        cellColors: editorStore.cellColors,
        createdAt: new Date(),
        modifiedAt: new Date(),
        // 履歴が空の場合は現在の状態のみを含む履歴を作成
        history:
          editorStore.history.length > 0
            ? editorStore.history
            : [{ cellColors: editorStore.cellColors }],
        // 履歴が空の場合は0を設定
        historyIndex: editorStore.history.length > 0 ? editorStore.historyIndex : 0,
      };

      // メモリとストレージの両方に保存
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
      //
      editorStore.currentSetId =
        editorStore.archivedSets.length > 0
          ? editorStore.archivedSets[editorStore.archivedSets.length - 1].id
          : null;
    }
  },

  // アーカイブされた状態を読み込み
  loadArchivedSet: (id: number) => {
    const archivedSet = editorStore.archivedSets.find((set) => set.id === id);

    if (archivedSet) {
      // 履歴を復元
      editorStore.history = archivedSet.history || [{ cellColors: [...archivedSet.cellColors] }];
      editorStore.historyIndex = archivedSet.historyIndex || 0;

      // console.log('historyIdex', editorStore.historyIndex, '\n', 'history', editorStore.history);

      // 現在の状態を復元
      const currentHistoryEntry = editorStore.history[editorStore.historyIndex].cellColors;

      // UI状態を更新
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
  // アーカイブの削除
  deleteArchivedSet: async (id: number) => {
    try {
      // ストレージから削除
      await deleteArchivedSetInStore(id);

      // メモリ上のデータを更新
      editorStore.archivedSets = editorStore.archivedSets.filter((set) => {
        return set.id !== id;
      });

      // 現在編集中のセットが削除された場合は初期状態にリセット
      if (editorStore.currentSetId === id) {
        editorStore.currentSetId = null;
        actions.resetToInitial();
      }
    } catch (err) {
      console.error(err);
    }
  },
  // アーカイブの更新
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
  // ユーティリティアクション
  // ログイン状態の設定
  setLoggedIn: (idLoggedIn: boolean) => {
    editorStore.isLoggedIn = idLoggedIn;
  },
  // 履歴の変更状態を更新
  // 初期状態からの変更有無を追跡
  updateHistoryChangedFlag: () => {
    editorStore.isHistoryChanged = editorStore.historyIndex !== 0 || editorStore.history.length > 1;
  },
};
