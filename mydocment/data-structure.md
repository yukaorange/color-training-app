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
    oldColor: string,
    newColor: string,
    // その他の必要な情報
  }
}
```

## User

```
{
  userId: string,
  title: string,
  etc...
}
```

## 実装時の注意点

1. Firebase Firestoreを使用する場合、この構造をそのまま使用
2. クライアント側では、valtioを使ってこの構造を反映した状態管理を行う
3. 編集履歴の管理にて、頻繁な更新が発生する可能性があるため、パフォーマンスに影響を与えないよう設計する
