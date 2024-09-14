# 色彩トレーニングアプリの状態管理設計ガイド

## 1. はじめに

このガイドでは、色彩トレーニングアプリの状態管理設計について、valtioを使用する際の具体的なアプローチを説明します。適切な状態管理設計は、アプリケーションのパフォーマンス、保守性、拡張性を向上させる重要な要素です。

## 2. 状態の分類

アプリケーションの状態を以下のように分類します：

1. グローバル状態：アプリ全体で共有される状態
2. ローカル状態：特定のコンポーネントに閉じた状態

## 3. グローバル状態の設計

### 3.1 色彩グリッドの状態

```typescript
import { proxy } from 'valtio';

interface ColorCell {
  id: string;
  backgroundColor: string;
  circleColor: string;
}

interface ColorGridState {
  cells: ColorCell[];
  activeCell: string | null;
}

export const colorGridState = proxy<ColorGridState>({
  cells: [],
  activeCell: null,
});
```

### 3.2 ユーザープロジェクトの状態

```typescript
interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProjectState {
  projects: Project[];
  currentProject: Project | null;
}

export const userProjectState = proxy<UserProjectState>({
  projects: [],
  currentProject: null,
});
```

### 3.3 アプリケーション全体の状態

```typescript
interface AppState {
  isLoading: boolean;
  currentView: 'grid' | 'projects' | 'settings';
  theme: 'light' | 'dark';
}

export const appState = proxy<AppState>({
  isLoading: false,
  currentView: 'grid',
  theme: 'light',
});
```

## 4. ローカル状態の設計

以下のコンポーネントではローカル状態を使用します：

### 4.1 ColorPickerコンポーネント

```typescript
import React, { useState } from 'react';

const ColorPicker: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  // ... コンポーネントの実装
};
```

### 4.2 SaveButtonコンポーネント

```typescript
import React, { useState } from 'react';

const SaveButton: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  // ... コンポーネントの実装
};
```

## 5. 状態管理のベストプラクティス

1. **状態の最小化**: 必要最小限の状態のみを管理し、派生データは計算して導出します。

2. **状態の正規化**: プロジェクトデータなど、複雑なデータ構造は正規化して管理します。

3. **イミュータブルな更新**: 状態の更新は常にイミュータブルに行い、予期せぬ副作用を防ぎます。

4. **非同期処理の管理**: データの取得や保存などの非同期処理は、状態管理とは別に管理します。

5. **型安全性の確保**: TypeScriptを活用し、状態の型を明確に定義します。

## 6. valtioを使用した状態更新の例

```typescript
import { useSnapshot } from 'valtio';

// 色彩グリッドの更新
export const updateCellColor = (cellId: string, color: string, isBackground: boolean) => {
  const cellIndex = colorGridState.cells.findIndex(cell => cell.id === cellId);
  if (cellIndex !== -1) {
    if (isBackground) {
      colorGridState.cells[cellIndex].backgroundColor = color;
    } else {
      colorGridState.cells[cellIndex].circleColor = color;
    }
  }
};

// プロジェクトの保存
export const saveCurrentProject = () => {
  if (userProjectState.currentProject) {
    userProjectState.currentProject.updatedAt = new Date();
    const projectIndex = userProjectState.projects.findIndex(
      p => p.id === userProjectState.currentProject!.id
    );
    if (projectIndex !== -1) {
      userProjectState.projects[projectIndex] = { ...userProjectState.currentProject };
    } else {
      userProjectState.projects.push({ ...userProjectState.currentProject });
    }
  }
};

// コンポーネントでの使用例
const ColorGrid: React.FC = () => {
  const { cells, activeCell } = useSnapshot(colorGridState);
  // ... コンポーネントの実装
};
```

## 7. 結論

適切な状態管理設計は、色彩トレーニングアプリの開発において重要な役割を果たします。グローバル状態とローカル状態を明確に区別し、valtioを効果的に使用することで、保守性が高く、パフォーマンスの良いアプリケーションを構築できます。この設計アプローチは、将来の機能拡張やデバッグにも役立ちます。

状態管理の設計は、アプリケーションの成長に合わせて継続的に見直し、最適化していくことが重要です。