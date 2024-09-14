accessibilityaccessibility# 色彩トレーニングアプリのアクセシビリティガイド：キーボードナビゲーション

## 1. はじめに

このガイドでは、色彩トレーニングアプリのアクセシビリティ、特にキーボードナビゲーションの実装について説明します。キーボードナビゲーションを適切に実装することで、より多くのユーザーが快適にアプリを使用できるようになります。

## 2. キーボードナビゲーションの基本原則

1. すべての機能をキーボードで操作可能にする
2. フォーカスの順序を論理的かつ直感的にする
3. 現在のフォーカス位置を視覚的に明確にする
4. ショートカットキーを提供し、効率的な操作を可能にする

## 3. 主要コンポーネントのキーボードナビゲーション実装

### 3.1 ColorGridコンポーネント

ColorGridは6x6のマスで構成される色彩表示グリッドです。

#### 実装例:

```tsx
import React, { useRef, useEffect } from 'react';

const ColorGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusedCell, setFocusedCell] = useState<number>(-1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gridRef.current) return;

      switch (e.key) {
        case 'ArrowRight':
          setFocusedCell(prev => Math.min(prev + 1, 35));
          break;
        case 'ArrowLeft':
          setFocusedCell(prev => Math.max(prev - 1, 0));
          break;
        case 'ArrowDown':
          setFocusedCell(prev => Math.min(prev + 6, 35));
          break;
        case 'ArrowUp':
          setFocusedCell(prev => Math.max(prev - 6, 0));
          break;
        case 'Enter':
        case ' ':
          // セルの選択やカラーピッカーの表示など
          break;
      }
    };

    gridRef.current.addEventListener('keydown', handleKeyDown);
    return () => {
      gridRef.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={gridRef} tabIndex={0} role="grid" aria-label="Color Grid">
      {/* グリッドのレンダリング */}
    </div>
  );
};
```

#### ポイント:
- 矢印キーでグリッド内を移動
- EnterまたはSpaceキーでセルを選択
- `tabIndex={0}`で`div`要素にフォーカス可能にする
- `role="grid"`でグリッドとしての役割を明示

### 3.2 ColorPickerコンポーネント

#### 実装例:

```tsx
import React, { useRef } from 'react';

const ColorPicker: React.FC = () => {
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        // 色相を増加
        break;
      case 'ArrowLeft':
        // 色相を減少
        break;
      case 'ArrowUp':
        // 明度を増加
        break;
      case 'ArrowDown':
        // 明度を減少
        break;
      case 'Enter':
        // 色を確定
        break;
    }
  };

  return (
    <div
      ref={pickerRef}
      tabIndex={0}
      role="application"
      aria-label="Color Picker"
      onKeyDown={handleKeyDown}
    >
      {/* カラーピッカーのUI */}
    </div>
  );
};
```

#### ポイント:
- 矢印キーで色相と明度を調整
- Enterキーで色を確定
- `role="application"`でカスタムコントロールであることを明示

### 3.3 SaveButtonコンポーネント

```tsx
import React from 'react';

const SaveButton: React.FC = () => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // 保存処理を実行
    }
  };

  return (
    <button
      onClick={handleSave}
      onKeyDown={handleKeyDown}
      aria-label="Save project"
    >
      Save
    </button>
  );
};
```

#### ポイント:
- EnterまたはSpaceキーで保存処理を実行
- `aria-label`で明確な説明を提供

## 4. グローバルキーボードショートカット

アプリ全体で使用できるキーボードショートカットを実装することで、操作の効率を高めることができます。

```tsx
import React, { useEffect } from 'react';

const App: React.FC = () => {
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        // プロジェクトの保存
      } else if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        // 新規プロジェクトの作成
      }
      // その他のショートカット
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  return (
    // アプリのコンポーネント
  );
};
```

## 5. フォーカス管理

フォーカスの視覚的なフィードバックを提供することで、現在の操作位置を明確にします。

```css
/* グローバルスタイル */
:focus {
  outline: 2px solid #4A90E2;
  outline-offset: 2px;
}

/* カスタムフォーカススタイル */
.color-cell:focus {
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.5);
}
```

## 6. キーボードナビゲーションのテスト

開発中は定期的に以下のテストを行います：

1. Tabキーでのナビゲーション：全ての操作可能な要素に順番にアクセスできるか
2. 矢印キーでの操作：グリッドやカラーピッカー内を適切に移動できるか
3. Enterキーでの操作：選択や実行が正しく機能するか
4. ショートカットキー：意図した通りに動作するか

## 7. 結論

キーボードナビゲーションを適切に実装することで、色彩トレーニングアプリの操作性と使いやすさが大きく向上します。各コンポーネントでのキーボード操作の考慮、グローバルショートカットの実装、そして適切なフォーカス管理を行うことで、より多くのユーザーが快適にアプリを使用できるようになります。

アクセシビリティは継続的な改善プロセスの一部であり、ユーザーフィードバックを基に定期的に見直し、改善していくことが重要です。