# Color Training App

色彩間隔を養うための Web アプリケーション

## intention

- デザイン重視のクリエイティブ業界への転職を目指す
- フロントエンドエンジニアとしての技術力を養うこと
- 多機能は求めず、直感的な操作で色彩感覚を養えることをコンセプトとする。

## プロジェクト概要

フロントエンドエンジニアとしての技術力を養うこと、そして<br>デザイン重視のクリエイティブ業界への転職を目指すものとして、<br>直感的な操作で色彩感覚を養える Web アプリケーションを開発する。

### 主要機能

- 6x6 マスの 3D 色彩表示グリッド

  - 表示: 常に正面から固定視点で表示
  - 実装: Three.js(R3F)を使用し、固定カメラ位置でシーンをレンダリング
  - 構造: 各セルは tile（blender model の cube & plane）で、以下の要素を持つ
    a. 表示される正面の面：正方形
    b. 正面の中心に正円：正方形の背景色とは独立して色を適用可能
  - 色彩構成:
    - 表示面で 2 色を表現（正方形の背景色と中心の正円の色）
    - 1 つの立方体で 2 色を保持
  - インタラクション:
    a. 個別立方体の回転：タップまたはクリックで立方体をピックアップ（拡大&カメラ方向に移動）
    b. raycaster で他の面をクリックすることで、即座にアクティブな立方体を変更可能
    c. 色彩を変更する面（正方形、正円）の切り替えにあっても、クリックで即座に変更可能（あらゆる状況下でも、raycaster で最初に交差したものをアクティブにする）

- 色彩操作システム

  - カラーピッカー(figma の UI を参考)
    a. 面の背景色選択用
    b. 中心の正円の色選択用
  - 編集機能
    - 戻る(ctrl + z)
    - 進む(ctrl + shift + z or ctrl + y)
    - 新規作成
    - 保存

- モードレスデザイン: 明示的なモード切替を最小限に抑え、コンテキストに応じたツールの提示
- ツールチップ: ユーザーの操作に応じて表示されるツールチップ
- ジェスチャーベースの操作: タップ、長押し、スワイプなどのジェスチャーを活用
- Firebase との統合: Firestore を使用したリアルタイムデータ同期
- 段階的な機能開放: ログイン状態に応じた機能の制御（例：保存、共有）

### データ構造
- 

### ユーザーインタラクション

- メイン画面（ゲスト/ログインユーザー共通）
  - 3D グリッドの直接操作: 個別立方体の回転
- 色彩作成/編集フロー
  - 立方体の面選択: タップまたはクリックで選択、カラーピッカーが起動する
  - 色彩適用: カラーピッカーからの直接適用
- プロジェクト管理（ログインユーザー）
  - 保存: メイン画面の保存ボタン
  - アーカイブアクセス: 下方向へのスワイプ（閾値を超えるスワイプアクション）でプロジェクト一覧を表示
  - プロジェクト切替: スクロール操作 or 左右スワイプ、クリックで保存済みプロジェクト間を移動
- ユーザー認証フロー
  - シームレスな統合: 操作を中断せずにログインプロセスを完了
  - ソーシャルログインオプション: Google アカウントとの連携
- 設定とカスタマイズ
  - パフォーマンス設定: デバイス性能に応じた描画品質の調整

## 技術スタック

- **フロントエンド**:
  - Next.js
  - React
  - TypeScript
- **3D グラフィックス**:
  - Three.js
  - React Three Fiber
  - React Three Drei
- **状態管理**: valtio
- **バックエンド**: Firebase
- **開発ツール**: ESLint, Prettier

## 開発アプローチ

- Next.js の SSG 機能を活用して静的コンテンツと初期データを生成
- React Three Fiber (r3f) を使用して 3D グラフィックスを実装
- Next.js の API ルートを活用して Firebase との通信を管理
- React ベースの開発スタイルを維持しつつ、Next.js 固有の機能を必要に応じて導入

## デザイン哲学

Apple 製品のようなミニマリズムと直感的な使いやすさを核心に据え、以下の原則に従います：

1. 視覚的な複雑さを最小限に抑え、必要不可欠な要素のみを表示
2. ジェスチャーベースの操作を重視
3. コンテキストに応じた情報とツールの提示
4. スムーズなアニメーションと遷移効果による明確なフィードバック

## 開発方針

#### コンポーネントベースの開発:

- 各パーツをコンポーネントとして個別に開発することは非常に良いアプローチです。これにより、コードの再利用性が高まり、保守性も向上します。

#### アトミックデザインの採用:

- UI コンポーネントを最小単位（アトム）から順に大きな単位（モレキュル、オーガニズム）へと組み上げていく方法を検討してみてはいかがでしょうか。これにより、一貫性のあるデザインシステムを構築できます。

#### Storybook の利用:

- 各コンポーネントを独立して開発・テストするために、Storybook の導入を検討してみてください。これにより、コンポーネントのビジュアルテストや開発効率の向上が期待できます。

#### モックデータの活用:

- バックエンドとの連携前に、モックデータを使用して UI の開発を進めることをお勧めします。これにより、フロントエンド開発に集中でき、後のバックエンド統合もスムーズになります。 -アニメーションの段階的実装:
- 基本的な UI コンポーネントを作成した後、アニメーションを段階的に追加していくアプローチが効果的です。

#### 状態管理の設計:

- valtio を使用する前に、アプリケーションの状態設計をしっかりと行ってください。どのデータをグローバルに管理し、どのデータをローカルに管理するかを明確にしておくことが重要です。

#### Three.js (R3F) の統合:

- 3D グリッドの実装は、他の UI コンポーネントとは別に開発を進めることをお勧めします。R3F の特性上、通常の React コンポーネントとは異なる考え方が必要になるためです。

#### レスポンシブデザインの考慮:

- 各コンポーネントを開発する際、レスポンシブデザインを念頭に置いてください。特に 3D グリッドの表示は、デバイスのサイズによって調整が必要になる可能性があります。

#### アクセシビリティの考慮:

- 開発の早い段階からアクセシビリティを考慮することをおすすめします。キーボードナビゲーションやスクリーンリーダーのサポートを含めて検討してください。

#### パフォーマンス最適化:

- 3D 表現を扱うため、パフォーマンスに注意を払う必要があります。早い段階からパフォーマンス測定ツールを使用し、必要に応じて最適化を行ってください。




# Color Training App Data Structure

## User

ユーザー情報を管理します。

```javascript
{
  id: string,         // ユーザーの一意のID
  name: string,       // ユーザー名
  email: string,      // メールアドレス
  createdAt: timestamp, // アカウント作成日時
  lastLogin: timestamp  // 最終ログイン日時
}
```

## Project

各色彩プロジェクトの情報を保存します。

```javascript
{
  id: string,         // プロジェクトの一意のID
  userId: string,     // プロジェクト作成者のID
  name: string,       // プロジェクト名
  createdAt: timestamp, // 作成日時
  updatedAt: timestamp, // 最終更新日時
  gridData: [         // 6x6x1のグリッドデータ
    {
      position: {
        x: number,
        y: number,
        z: number
      },              // グリッド内の位置
      frontColor: string, // 正方形の背景色（HEX形式）
      circleColor: string, // 中心の正円の色（HEX形式）
      backColor: string   // 裏面の色（HEX形式）
    }
  ]
}
```

## EditHistory

ユーザーの編集操作を記録します。

```javascript
{
  id: string,         // 編集履歴の一意のID
  projectId: string,  // 関連するプロジェクトのID
  timestamp: timestamp, // 編集日時
  action: string,     // 実行されたアクション（例：'colorChange', 'rotate'）
  details: {          // アクションに応じた詳細情報
    position: {
      x: number,
      y: number,
      z: number
    },
    oldColor: string,
    newColor: string,
    // その他の必要な情報
  }
}
```

## UserSettings

ユーザーごとの設定を保存します。

```javascript
{
  userId: string,     // ユーザーのID
  performance: string, // パフォーマンス設定（'low', 'medium', 'high'）
  theme: string,      // UIテーマ設定
  // その他のカスタム設定
}
```

## 実装時の注意点

1. Firebase Firestoreを使用する場合、この構造をそのまま使用できます。
2. クライアント側では、valtioを使ってこの構造を反映した状態管理を行うことができます。
3. 編集履歴の管理には注意が必要です。頻繁な更新が発生する可能性があるため、パフォーマンスに影響を与えないよう設計する必要があります。

この構造を基に、プロジェクトの進行に伴って新たな要件が発生した場合は、柔軟に対応できるよう調整を加えていくことをお勧めします。



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


# 色彩トレーニングアプリのStorybook活用ガイド

## 1. はじめに

このガイドは、色彩トレーニングアプリの開発におけるStorybook活用方法をまとめたものです。Storybookを使用することで、UIコンポーネントの開発効率を向上させ、デザインの一貫性を保ちつつ、フロントエンドエンジニアとしての技術力を養うことができます。

## 2. 主要コンポーネントとStorybook活用

### 2.1 ColorGridコンポーネント

ColorGridは、6x6のマスで構成される3D色彩表示グリッドです。

#### Storybookでの実装例:

```typescript
// ColorGrid.stories.tsx
import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ColorGrid, ColorGridProps } from './ColorGrid';

export default {
  title: 'Components/ColorGrid',
  component: ColorGrid,
} as Meta;

const Template: Story<ColorGridProps> = (args) => <ColorGrid {...args} />;

export const Default = Template.bind({});
Default.args = {
  colors: Array(36).fill(null).map(() => ({
    backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    circleColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
  })),
};

export const Monochrome = Template.bind({});
Monochrome.args = {
  colors: Array(36).fill(null).map((_, i) => ({
    backgroundColor: `rgb(${i * 7}, ${i * 7}, ${i * 7})`,
    circleColor: `rgb(${255 - i * 7}, ${255 - i * 7}, ${255 - i * 7})`,
  })),
};
```

#### 活用ポイント:
- 異なる色の組み合わせでのグリッド表示をテスト
- モノクロ、カラフル、特定の色相など、様々なパターンを容易に確認
- グリッドのレスポンシブ性をチェック

### 2.2 ColorPickerコンポーネント

ColorPickerは、ユーザーが色を選択するためのインターフェースです。

#### Storybookでの実装例:

```typescript
// ColorPicker.stories.tsx
import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ColorPicker, ColorPickerProps } from './ColorPicker';

export default {
  title: 'Components/ColorPicker',
  component: ColorPicker,
} as Meta;

const Template: Story<ColorPickerProps> = (args) => <ColorPicker {...args} />;

export const Default = Template.bind({});
Default.args = {
  initialColor: '#FF5733',
  onChange: (color) => console.log(`Selected color: ${color}`),
};

export const WithCustomPalette = Template.bind({});
WithCustomPalette.args = {
  ...Default.args,
  customPalette: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33'],
};
```

#### 活用ポイント:
- 異なる初期色での表示をテスト
- カラー選択時のイベントハンドリングを確認
- カスタムカラーパレットの表示と機能をチェック

### 2.3 SaveButtonコンポーネント

SaveButtonは、ユーザーの作品を保存するためのボタンコンポーネントです。

#### Storybookでの実装例:

```typescript
// SaveButton.stories.tsx
import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SaveButton, SaveButtonProps } from './SaveButton';

export default {
  title: 'Components/SaveButton',
  component: SaveButton,
} as Meta;

const Template: Story<SaveButtonProps> = (args) => <SaveButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  onClick: () => console.log('Save button clicked'),
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const Saving = Template.bind({});
Saving.args = {
  ...Default.args,
  isSaving: true,
};
```

#### 活用ポイント:
- 通常状態、無効状態、保存中状態の表示をテスト
- クリックイベントのハンドリングを確認
- ボタンのスタイリングとアニメーションをチェック

## 3. Storybookを活用する利点

1. **コンポーネントの独立開発**: 各UIパーツを個別に開発・テストできるため、効率的に作業を進められます。

2. **デザインの一貫性**: すべてのコンポーネントを一箇所で確認できるため、アプリ全体のデザインの一貫性を保ちやすくなります。

3. **インタラクションのテスト**: ユーザーの操作をシミュレートし、直感的な操作感を実現できているか確認できます。

4. **レスポンシブデザインの確認**: 異なる画面サイズでの表示を簡単にテストできます。

5. **アクセシビリティの向上**: コンポーネントごとにアクセシビリティをチェックし、改善できます。

6. **ドキュメンテーション**: 実行可能なドキュメントとして機能し、プロジェクトの理解を深めることができます。

## 4. 導入手順

1. プロジェクトにStorybookを追加: `npx storybook init`
2. 各コンポーネントのStoriesファイルを作成 (例: `ColorGrid.stories.tsx`)
3. Storybookを起動: `npm run storybook`

## 5. 結論

Storybookを活用することで、色彩トレーニングアプリの開発効率と品質を向上させることができます。各コンポーネントを個別に開発・テストすることで、デザインの一貫性を保ちつつ、ユーザビリティの高いインターフェースを実現できます。また、このプロセスを通じてフロントエンドエンジニアとしての技術力を養い、ポートフォリオとしての価値を高めることができます。


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

# 色彩トレーニングアプリ 更新版画面構成とレンダリング方法（ホームページ含む）

## 主要画面構成

1. ホームページ

   - URL: `/` (SSG)
   - 機能:
     - アプリの概要説明 (SSG)
     - エディターとアーカイブへのリンク (SSG)
     - ログイン/サインアップへの導線 (SSG)

2. エディターページ

   - URL: `/editor` (SSG + CSR)
   - 機能:
     - 3D グリッド操作 (CSR)
     - アーカイブへのリンク (SSG)
   - モーダル:
     - ログイン (CSR)
     - ユーザー情報 (CSR)
     - メタ情報入力/保存 (CSR)
     - カラーピッカー (CSR)

3. アーカイブページ
   - URL: `/archive` (SSG + CSR)
   - 機能:
     - プロジェクト一覧表示 (CSR with SWR)
     - エディターへのリンク (SSG)
   - モーダル:
     - ログイン (CSR)
     - ユーザー情報 (CSR)
     - 実績インポート確認 (CSR)

## レンダリング方法の詳細

### ホームページ

- 基本構造 (SSG)
- 静的コンテンツ（アプリ説明、特徴紹介） (SSG)
- エディターとアーカイブへのリンク (SSG)
- 認証状態に応じた表示（ログイン/ログアウト） (CSR)

### エディターページ

- 基本構造 (SSG)
- 3D グリッド操作 (CSR)
- ユーザー操作に応じたインタラクション (CSR)
- データフェッチ:
  - 初期状態 (SSG)
  - ユーザー固有のデータ (CSR, 必要に応じて SWR)

### アーカイブページ

- 基本構造 (SSG)
- プロジェクト一覧表示 (CSR with SWR)
- データフェッチ: プロジェクト一覧 (SWR)

## 実装アドバイス

1. **ルーティング**:

   - `pages/index.tsx`でホームページを実装 (SSG)
   - `pages/editor.tsx`と`pages/archive.tsx`で各機能ページを実装 (SSG + CSR)
   - Next.js の`Link`コンポーネントを使用してページ間リンクを実装 (SSG)

2. **共通レイアウト**:

   - `components/Layout.tsx`で共通レイアウトを実装 (SSG)
   - 各ページでこのレイアウトを使用 (SSG)

3. **状態管理**:

   - valtio を使用してグローバル状態を管理 (CSR)
   - ユーザー認証状態、現在の編集プロジェクトなどをグローバル状態で管理 (CSR)

4. **パフォーマンス最適化**:

   - 3D グリッドコンポーネントは動的インポートを使用 (CSR)

5. **SEO 対策**:

   - `next/head`を使用して適切なタイトルやメタデータを設定 (SSG)
   - ホームページでは特に重要なキーワードやデスクリプションを設定 (SSG)

6. **アクセシビリティ**:

   - セマンティックな HTML 構造を使用 (SSG)
   - キーボードナビゲーションのサポート (CSR)
   - ARIA 属性の適切な使用 (SSG + CSR)

7. **エラーハンドリング**:

   - グローバルエラーハンドリング機能を実装 (CSR)
   - ユーザーフレンドリーなエラーメッセージ表示 (CSR)

8. **レスポンシブデザイン**:

   - モバイルファーストアプローチで CSS を設計 (SSG)
   - メディアクエリを使用して異なる画面サイズに対応 (SSG)

9. **認証フロー**:

   - Firebase Authentication と Next.js を統合 (CSR)
   - 認証済みユーザーのみがアクセスできるページや機能を実装 (CSR)
   - ホームページで未認証ユーザーへの案内を表示 (CSR)

10. **テスト**:
    - Jest と React Testing Library でユニットテストとコンポーネントテストを実装
    - Cypress で E2E テストを実装

この構成により、ユーザーは直接主要機能にアクセスでき、スムーズなナビゲーションが可能になります。SSG と CSR を適切に組み合わせることで、高速な初期ロードと動的なユーザーエクスペリエンスの両立が可能です。

継続的な改善のため、ユーザーフィードバックを収集し、必要に応じて機能や UI を調整していくことをおすすめします。
