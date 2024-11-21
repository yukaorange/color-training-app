# Color Training App

- 色彩感覚を養うための直感的なWebアプリケーション

## 概要

- Color Training App（以下、「本アプリ」という。）は、インタラクティブな色彩トレーニングツールです。6x6の3Dグリッドを使用して、ユーザーは色彩の関係性と調和を視覚的に訓練することができます。
- 書籍「勝てるデザイン」（著:前田高志、幻冬舎）に掲載されていた、”色を使う”ための感覚を養うトレーニングを参考に、デジタルでの実装を独自に行いました。

## 著作権と帰属

- オリジナルのトレーニング手法のアイデアは上記書籍によるものです。本アプリの開発および運営は、上記書籍および著者とは直接の関係を持たず、独立して行われています。

## アプリを作成した目的

- フロントエンドエンジニアとしてのスキルを向上するため
- 直感的な操作で色彩感覚を養うため
- 公開後も継続して個人的な技術向上のために使用

## 主要機能

- 6x6マスの3D色彩表示グリッド
- 直感的な色彩選択システム
- Firebase,FireStore統合による色彩パレットの保存
- ユーザー認証システム

## 技術スタック

- フロントエンド: Next.js, React, TypeScript
- 3Dグラフィックス: Three.js, R3F
- 状態管理: valtio
- バックエンド: Firebase,FireStore
- 認証:NextAuth, google認証
- 開発ツール: ESLint, Prettier

## インストール

```
git clone https://github.com/yukaorange/color-training-app.git
cd color-training-app
npm install
or
yarn install
```

## 使用方法

- 開発サーバーを起動:

```
npm run dev
or
yarn dev
```

- ブラウザで http://localhost:3000 を開いて本アプリにアクセス。

## 開発アプローチ

- figma,adobe illustratorによるデザイン作成
- アトミックデザインの採用
- コンポーネントベースの開発
- レスポンシブデザインとアクセシビリティの重視

## デザイン方針

- Apple製品のようなミニマリズムと直感的な使いやすさ重視し、以下の原則を軸に据えました：

1. 視覚的な複雑さを最小限に抑える
2. 直感的なの操作感を重視
3. コンテキストに応じた情報の提示
4. 明確なインタラクションによるフィードバック

## ライセンス

- このプロジェクトはMITライセンスの下で公開されています。

## 連絡先

- X(Twitter) : ()[]

- 公開中: https://color-training-app.vercel.app/

## 経緯

- 幻冬舎から出版された「勝てるデザイン」（著:前田高志、幻冬舎）に掲載されていた、”色を使う”感覚を養うためのトレーニングが紹介されており、これに強く関心を持った。
- フロントエンドエンジニアとして能力向上とデザインのバランス感覚を養うことの両立を目的に、上記トレーニングの内容をモチーフにしたアプリケーション開発を画策した。
- CRUDのロジックに苦戦、変更履歴や未編集状態、未保存状態など、時系列が複雑であった。
- ユーザ認証機能の実装について、まだパスワード変更や
