# SupabaseとNext.jsを連携して、ユーザーの認証機能とプロフィール情報の管理や更新を使用する。

### 参照したドキュメント

https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?queryGroups=language&language=ts



### 必要なソフトウェア

React
Next.js
Node.js
typescript
supabase(データベース)


### インストール手順

##### Node.js
https://nodejs.org のページからNodo.jsのLTS(推奨版)をダウンロード
ダウンロードしたmsiファイルを実行し画面に従いインストールする。
コマンドプロンプトやターミナルで
`node -v`　`npm -v`
を入力し、それぞれインストールしたバージョンが表示されれば完了。


##### パッケージのインストール
`npm install`

supabase.js(supabaseクライアントのライブラリ)
@supabase/ssr(supabaseのサーバーサイド認証パッケージ)



### supabaseの設定

1.supabaseで新しいプロジェクトを作成
 https://supabase.com/dashboard にサインアップ、新しいプロジェクトを作成し起動まで待つ。

2.データベースのスキーマ設定
SQL Editorのページを開き`database.sql`の内容を貼り付けRUNで実行。
(もしくは、QuickstartsからUser Management Starterをクリックでも実行可能)


3.APIキーの取得
Project SettingsからAPIページへ移動
Project URLの`URL`とProject API Keysの`anon public`の項目をコピー

4.メールテンプレートの変更
AuthenticationからEmail Templatesページを開く。
Confirm signupタブのHTMLの部分を書きかえる。
`{{ .ConfirmationURL }}`を
`{{ .ConfirmationURL }}{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`
へ書きかえ。



### 環境変数の設定

1.`.env.local.example`ファイルをコピーし、コピーしたファイルの名前を`.env.local`へ書きかえる。

2.APIキーの入力

```.env.local
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

`YOUR_SUPABASE_URL`の部分を先程取得したProject URLへ
`YOUR_SUPABASE_ANON_KEY`の部分を同じく取得したAPI Keysのanon publicの項目へ書きかえる。



### 動作確認

`npm run dev`で[localhost:3000](http://localhost:3000)のページを起動

[localhost:3000/login](http://localhost:3000/login)へ移動

EmailとPasswordを入力しSIGN UPボタンをクリックすると入力したメールアドレスに登録用のメールが届く
Confirm your mailをクリックすると登録が完了し
[localhost:3000/account](http://localhost:3000/account)へ移動し各種プロフィールの設定が可能に。
# supabase-groupchat1
# supabase-groupchat1
