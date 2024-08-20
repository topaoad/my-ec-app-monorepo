# 当リポジトリについて

最新のモダンスキルを使った EC サイトのフルスタックアプリケーションを作成するものです

## 実装内容

- Next.js + Supabase で認証機能、データベースとの CRUD を実装する
- Prisma を使った ORM、データベースのマイグレーション、シーディングを実装する
- スキーマ定義から型を生成することで、スキーマ駆動開発を実装する

## 技術選定

- Next.js 14
- TypeScript
- Tailwind CSS
- Auth.js／CLerk（認証機能・Google などのソーシャル認証を予定）
- Prizma（ORM）
- Jotai(状態管理)
- TanStackQuery（データフェッチ）
- Stripe（決済機能）
- MicroCMS（商品管理）
- SendGrid（お問い合わせや決済用の案内メール）
- jest/Cyperess（テスト）
- Algolia（検索機能）
- Mantine（UI コンポーネント）

## サイトイメージ

- 会員登録して商品を購入するサイト
- 購入履歴やカート機能を実装
- 管理者は Micro CMS 上から商品の登録、編集、削除ができる
- サブスクではなくワンショット型の商品を販売する

## 考慮しないこと

- 決済後の商品の配送、返品処理対応など（返金は Stripe で対応）

## 開発にあたっての目標

- 状態管理の Jotai を使った状態管理
- TanStackQuery を使ったデータフェッチ、状態管理の削減
- Stripe を使った決済
- お問い合わせなどの案内メールの実装
- UX/UI の向上
- テストの実装

## Prisma による ORM の管理メモ

- マイグレーションファイルを作成する（--name の後ろにファイル名）
  npx prisma migrate dev --name
  このコマンドの実行により、npx zod-prisma-types が実行されて、スキーマから型を生成する
  ※npx prisma migrate dev --name は、スキーマファイル (schema.prisma) に記述された最新のスキーマね定義と、prisma/migrations ディレクトリ内にある既存のマイグレーションファイルを比較します。
- マイグレーションファイルを適用（本番環境適用時、他の人が作成したマイグレーションファイル適用）
  npx prisma migrate deploy
- seed.ts のレコードをテーブルに適用する
  npx prisma db seed
- マイグレーションファイルの作成なしにデータベースのテーブルを変更する（開発用。使用しなくても良い）
  npx prisma db push
- Prisma クライアントを生成する（型定義を生成する）※スキーマが更新されたタイミング
  npx prisma generate

## 参考サイト

### 全般

- [【個人開発】最新の Next.js+NextAuth.js+prisma+microCMS で EC サイト作ってみた【フルスタックアプリケーション】](https://qiita.com/mamimami0709/items/7ce5e26afea1fded0747)

### フォーム・バリデーション

- [React Hook Form と Zod の基本的な使い方](https://qiita.com/y-suzu/items/952d417f0853341a97df)
- [React Hook Form の基本を理解してフォームを作成してみよう](https://reffect.co.jp/react/react-hook-form#FormProvider)

### 認証

- [Clerk で"ラクラーク"に認証・認可周りを実装する](https://zenn.dev/msy/articles/a1ab4acef4c811#%E5%88%9D%E6%9C%9F%E8%A8%AD%E5%AE%9A)
- [Auth.js を完全に理解する (Next.js App Router 実装編) #2](https://qiita.com/kage1020/items/8224efd0f3557256c541#%E3%81%AF%E3%81%98%E3%82%81%E3%81%AB)

### 状態管理

- [jotai 公式](https://jotai.org/)
- [【Jotai】React の状態管理はコレで決まり！！](https://qiita.com/al_tarte/items/bfaefc34e9b0be91c72a)

### TanStackQuery

- [初めてでも安心 TanStack Query v5 の基本的な設定方法と動きを学ぶ](https://reffect.co.jp/react/tanstack-query-v5#i-4)
- [TanStack Query(React Query)で作るシンプル ToDo アプリで CRUD 処理](https://reffect.co.jp/react/tanstack-query#TanStack_Query-3)
- [TanStack Query 公式](https://tanstack.com/query/latest)

### Prisma

- [TypeScript ORM「Prisma」のはじめかた](https://www.memory-lovers.blog/entry/2021/10/13/113000)

### 実装メモ

- セッションの strategy は database を使いたいが、そうすると middleware の判別がうまくいかないので、jwt を使っている
  　※strategy を使い、セッション情報をサーバーサイドでもたせると next-auth.session-token には sessionid だけが格納されるので
  jwt でセッション情報そのものを格納するよりセキュアとなる。

### デプロイメモ

- vercel へのデプロイ時に認証関連でエラーが発生。コールバック URL の設定などに気をつけること
  NEXTAUTH_URL は不要らしい（https://next-auth.js.org/deployment）

2024/6/3 次の作業時に向けて

- フェッチ時に参照していた NEXTAUTH_URL をBASE_URLに変えて設定し、かつ本番環境では NEXTAUTH_URL を使わないようにする

7/12　タスクの整理
UI

- 買い物かごのカート
- お気に入りページ
- 購入履歴ページ
- プロフィールページ

機能

- 商品購入時の残数の更新
- 購入履歴取得のため、ユーザー情報とStripeの紐付け
- 商品購入時の情報入力画面（送付先）
- 商品購入時のメール
- 発注取りやめの機能
- テストの実装
