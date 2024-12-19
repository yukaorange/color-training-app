import { useEffect } from 'react';

import { editorStore, initialCellColors } from '@/store/editorStore';

// 16進数カラーコードのバリデーション
// 正規表現による厳密な形式チェック：
// 1. '#'で始まる
// 2. その後に6桁の16進数（0-9またはA-F、大文字小文字を許容）
// 3. 完全一致（部分一致は許可しない）
const isValidColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

/**
 * アプリケーションの状態をローカルストレージから復元するカスタムフック
 *
 * 実装の特徴：
 * 1. マウント時の一回のみ実行
 * 2. 厳格なデータバリデーション
 * 3. 破損データに対する優雅な回復メカニズム
 */
export function useLoadState() {
  useEffect(() => {
    const savedState = localStorage.getItem('editorStore');

    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);

        // セルカラーの検証と修復
        // Array.isArrayによるチェック：
        // 1. 型の安全性確保（nullやundefinedを除外）
        // 2. オブジェクトの構造を保証
        // 3. mapメソッドの安全な実行を確保
        if (Array.isArray(parsedState.cellColors)) {
          // 各色値を検証し、不正な値は初期値で置換
          // スプレッド構文ではなく明示的なプロパティ指定により型の整合性を確保
          parsedState.cellColors = parsedState.cellColors.map((cell: any) => ({
            square: isValidColor(cell.square) ? cell.square : initialCellColors.square,
            circle: isValidColor(cell.circle) ? cell.circle : initialCellColors.circle,
          }));
        }
        // アーカイブセットの検証と修復
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

        // 検証済みのデータでストアを更新
        // Object.assignを使用する理由：
        // 1. 部分的な更新が可能
        // 2. undefined値の上書きを防止
        // 3. プロトタイプチェーンを保持
        Object.assign(editorStore, parsedState);
      } catch (error) {
        console.error('Failed to parse saved state', error);
      }
    }
  }, []);
}
