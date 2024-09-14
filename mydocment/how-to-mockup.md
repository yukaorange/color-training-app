# 色彩トレーニングアプリのモックデータ活用とGSAPアニメーション実装ガイド

## 1. モックデータの活用

### 1.1 モックデータの設計

色彩トレーニングアプリの主要なデータ構造を考慮し、以下のようなモックデータを設計します。

```typescript
// types.ts
export interface ColorCell {
  id: string;
  backgroundColor: string;
  circleColor: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  colorGrid: ColorCell[];
}

// mockData.ts
import { ColorCell, Project } from './types';

export const mockColorGrid: ColorCell[] = Array(36).fill(null).map((_, index) => ({
  id: `cell-${index}`,
  backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
  circleColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
}));

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Sunset Palette',
    createdAt: '2024-09-01T12:00:00Z',
    updatedAt: '2024-09-02T15:30:00Z',
    colorGrid: mockColorGrid,
  },
  // 追加のプロジェクト...
];
```

### 1.2 モックデータの使用

コンポーネント内でモックデータを使用する例:

```tsx
import React from 'react';
import { mockColorGrid } from './mockData';
import { ColorGrid } from './ColorGrid';

export const ColorGridContainer: React.FC = () => {
  return <ColorGrid cells={mockColorGrid} />;
};
```

### 1.3 モックAPIの作成

実際のAPIが準備できるまでの間、モックAPIを作成して使用します。

```typescript
// mockApi.ts
import { mockProjects, mockColorGrid } from './mockData';
import { Project, ColorCell } from './types';

export const api = {
  getProjects: (): Promise<Project[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockProjects), 500);
    });
  },

  getColorGrid: (projectId: string): Promise<ColorCell[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockColorGrid), 300);
    });
  },

  saveProject: (project: Project): Promise<Project> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...project, updatedAt: new Date().toISOString() }), 700);
    });
  },
};
```

この方法により、実際のAPIが完成する前からフロントエンド開発を進められます。

## 2. GSAPを使用したアニメーションの段階的実装

### 2.1 GSAPのセットアップ

まず、プロジェクトにGSAPをインストールします:

```bash
npm install gsap
```

### 2.2 基本的なアニメーションの実装

ColorGridコンポーネントで、セルの表示アニメーションを実装する例:

```tsx
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ColorCell } from './types';

interface ColorGridProps {
  cells: ColorCell[];
}

export const ColorGrid: React.FC<ColorGridProps> = ({ cells }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      gsap.from(gridRef.current.children, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'back.out(1.7)',
      });
    }
  }, [cells]);

  return (
    <div ref={gridRef} className="grid grid-cols-6 gap-2">
      {cells.map((cell) => (
        <div
          key={cell.id}
          className="w-16 h-16 rounded"
          style={{ backgroundColor: cell.backgroundColor }}
        >
          <div
            className="w-8 h-8 rounded-full mx-auto mt-4"
            style={{ backgroundColor: cell.circleColor }}
          />
        </div>
      ))}
    </div>
  );
};
```

### 2.3 インタラクティブなアニメーションの追加

セルをクリックした際のアニメーション例:

```tsx
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ColorCell } from './types';

interface ColorCellProps {
  cell: ColorCell;
  onClick: (cell: ColorCell) => void;
}

export const ColorCellComponent: React.FC<ColorCellProps> = ({ cell, onClick }) => {
  const cellRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (cellRef.current) {
      gsap.to(cellRef.current, {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        onComplete: () => onClick(cell),
      });
    }
  };

  return (
    <div
      ref={cellRef}
      className="w-16 h-16 rounded cursor-pointer"
      style={{ backgroundColor: cell.backgroundColor }}
      onClick={handleClick}
    >
      <div
        className="w-8 h-8 rounded-full mx-auto mt-4"
        style={{ backgroundColor: cell.circleColor }}
      />
    </div>
  );
};
```

### 2.4 複雑なアニメーションシーケンス

プロジェクト保存時のアニメーション例:

```tsx
import React, { useRef } from 'react';
import { gsap } from 'gsap';

export const SaveButton: React.FC<{ onSave: () => Promise<void> }> = ({ onSave }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const checkmarkRef = useRef<SVGSVGElement>(null);

  const handleSave = async () => {
    if (buttonRef.current && textRef.current && checkmarkRef.current) {
      // ボタンを無効化
      buttonRef.current.disabled = true;

      // 保存アニメーション
      gsap.to(buttonRef.current, { width: '40px', duration: 0.3, ease: 'power2.inOut' });
      gsap.to(textRef.current, { opacity: 0, duration: 0.2 });

      // APIコール
      await onSave();

      // 完了アニメーション
      gsap.to(checkmarkRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' });

      // リセットアニメーション
      gsap.to(buttonRef.current, { width: '100px', duration: 0.3, delay: 1, ease: 'power2.inOut' });
      gsap.to(textRef.current, { opacity: 1, duration: 0.2, delay: 1.2 });
      gsap.to(checkmarkRef.current, { scale: 0, opacity: 0, duration: 0.3, delay: 1 });

      // ボタンを再度有効化
      buttonRef.current.disabled = false;
    }
  };

  return (
    <button ref={buttonRef} onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
      <span ref={textRef}>Save</span>
      <svg ref={checkmarkRef} className="w-6 h-6 hidden" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeWidth="2" d="M20 6L9 17l-5-5" />
      </svg>
    </button>
  );
};
```

## 3. 段階的実装のアプローチ

1. 基本的なUIコンポーネントを作成し、静的な状態で動作を確認
2. 簡単なアニメーション（フェードイン、スケールなど）を追加
3. ユーザーインタラクションに応じたアニメーションを実装
4. 複雑なアニメーションシーケンスを段階的に追加
5. パフォーマンスの最適化（必要に応じてGSAPのTimeline機能を使用）

## 4. 結論

モックデータを活用することで、バックエンド開発と並行してフロントエンド開発を進めることができます。また、GSAPを使用したアニメーションを段階的に実装することで、ユーザー体験を向上させつつ、開発の複雑さを管理することができます。

これらのアプローチを組み合わせることで、効率的かつ柔軟な開発プロセスを実現し、高品質な色彩トレーニングアプリを構築することができます。