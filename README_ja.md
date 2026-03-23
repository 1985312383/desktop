<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README_zh.md">简体中文</a> |
  日本語 |
  <a href="./README_de.md">Deutsch</a>
</p>

# GitHub Desktop i18n

このリポジトリは、[desktop/desktop](https://github.com/desktop/desktop) をベースにした GitHub Desktop の i18n フォークです。

主な目的は以下のとおりです。

- できるだけ upstream の GitHub Desktop に追従すること
- upstream のリリースをベースに追加の i18n 変更を維持すること
- GitHub Releases 経由でダウンロード可能なビルドを配布すること

## Upstream との関係

- upstream プロジェクト：[`desktop/desktop`](https://github.com/desktop/desktop)
- このプロジェクトは upstream の GitHub Desktop リリースをベースに、追加の i18n 調整を行っています
- ビルドおよびパッケージングの流れは、可能な限り upstream に近い形を維持しています

GitHub Desktop 本体への機能追加や修正を行いたい場合は、upstream リポジトリに issue または pull request を送ることを推奨します。

## ダウンロード

リリースページ：

- [GitHub Releases](https://github.com/1985312383/desktop/releases)

各 Release ページには以下のようなアセットが含まれます。

- `GitHub Desktop <version> checksums`
- `GitHub Desktop <version> macOS arm64`
- `GitHub Desktop <version> macOS x64`
- `GitHub Desktop <version> Windows x64 Delta Nupkg`
- `GitHub Desktop <version> Windows x64 Full Nupkg`
- `GitHub Desktop <version> Windows x64 EXE Installer`
- `GitHub Desktop <version> Windows x64 MSI Installer`

説明：

- `macOS arm64`：Apple Silicon デバイス向け（M1、M2、M3 など）
- `macOS x64`：Intel Mac 向け
- `Windows x64 EXE Installer`：一般的な Windows ユーザー向け
- `Windows x64 MSI Installer`：管理者展開や企業環境向け
- `Windows x64 Full Nupkg`：完全アップデートパッケージ
- `Windows x64 Delta Nupkg`：差分アップデートパッケージ
- `checksums`：ファイル整合性確認用

## バージョン命名

このプロジェクトのリリース名は upstream の GitHub Desktop バージョンにできるだけ合わせつつ、追加サフィックスを付けます。

- `3.5.6-alpha`
- `3.5.6-beta`

意味：

- ベースのバージョン番号は upstream GitHub Desktop のバージョンに対応します
- `-alpha` と `-beta` は、その upstream バージョンに対して追加の i18n 作業が行われたことを示します

これらのサフィックスはこの i18n フォーク独自のものであり、公式 upstream リリース名ではありません。

## 更新について

ご注意ください：

- アプリ内の一部リンクは引き続き GitHub Desktop の公式サイトまたは upstream プロジェクトを指す場合があります
- アプリ内アップデートの挙動も、基本的には公式 GitHub Desktop の流れに近いままです

この i18n フォークの更新が必要な場合は、以下の Release ページから手動でダウンロードしてください。

- [https://github.com/1985312383/desktop/releases](https://github.com/1985312383/desktop/releases)

## ビルドとリリース

このプロジェクトでは、GitHub Release の公開後に GitHub Actions で自動ビルドし、その成果物を同じ Release ページへアップロードします。

現在のビルド対象：

- macOS arm64
- macOS x64
- Windows x64

## Upstream リンク

- [GitHub Desktop 公式サイト](https://desktop.github.com)
- [upstream リポジトリ: desktop/desktop](https://github.com/desktop/desktop)

## ライセンス

このリポジトリは upstream プロジェクトのライセンスを引き続き採用します。

- [MIT](LICENSE)
