# Shutokun-re (首都圏-RE)

Shutokun-re is a comprehensive mobile application designed for Japanese language learners. It provides tools for studying vocabulary, practicing Kana, and analyzing sentences. The app features a "Custom Mode" that allows users to generate their own study sets from text files, PDFs, or by scanning physical documents with OCR.

## ✨ Features

- **JLPT Study Mode:** Prepare for the Japanese Language Proficiency Test.
- **Kana Quiz:** Practice and master Hiragana and Katakana.
- **Sentence Analyzer:** Break down Japanese sentences to understand grammar and vocabulary.
- **Custom Study Sets:**
  - Import vocabulary from `.txt` files.
  - Import vocabulary from `.pdf` files via a self-hosted server.
  - Scan documents and images using a self-hosted OCR service.
  - Study custom-generated vocabulary using a built-in flashcard mode.
- **User Accounts & Progress Sync:** Sign in to sync your progress across devices (powered by AWS Amplify).

## 🛠️ Tech Stack

- **Frontend:** React Native with Expo
- **Language:** TypeScript
- **Routing:** Expo Router
- **Backend (Cloud):** AWS Amplify (Cognito for Auth, AppSync GraphQL API)
- **Backend (Self-Hosted):** Python Flask service for PDF and OCR processing.
- **Local Database:** Expo SQLite

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- AWS Amplify CLI: `npm install -g @aws-amplify/cli`
- Python 3.x and `pip` for the backend service.
- [Tesseract OCR Engine](https://tesseract-ocr.github.io/) installed on the machine that will run the backend service.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd shutokun-re
```

### 2. Install Frontend Dependencies

Install the necessary Node.js packages for the React Native application.

```bash
npm install
```

### 3. Configure AWS Amplify Backend

The project uses AWS Amplify for its cloud backend. You need to pull the backend configuration to your local environment.

1.  **Initialize Amplify:**
    ```bash
    amplify init
    ```
    Follow the on-screen prompts. It will ask you to connect to your AWS account.

2.  **Pull Backend Definition:**
    ```bash
    amplify pull
    ```
    This will fetch the latest backend definition from the cloud and generate the necessary `aws-exports.js` file in the `src/` directory.

### 4. Configure and Run the Self-Hosted Backend

The PDF and OCR extraction features depend on a separate Python service.

**For detailed setup instructions, please refer to the README inside the service directory:**
[`./pdf-extraction-service/README.md`](./pdf-extraction-service/README.md)

**Quick Summary:**
1.  Run the Python service on your server (e.g., a Proxmox VM).
2.  Set up a secure way to access it from your phone (e.g., using Tailscale).
3.  Open `app/(tabs)/custom-mode.tsx` in your code editor.
4.  Find the `SERVER_IP` constant and replace the placeholder with your server's IP address.

    ```javascript
    // Before
    const SERVER_IP = '<YOUR_SERVER_IP>';

    // After (example)
    const SERVER_IP = '100.101.102.103';
    ```

### 5. Run the Mobile App

Once both backends are configured, you can run the mobile application.

```bash
npx expo start
```

This will start the Metro bundler. You can then run the app on a physical device using the Expo Go app or in an emulator/simulator on your computer.

---
## Japanese Translation (日本語翻訳)

# 首都圏-RE (Shutokun-re)

首都圏-REは、日本語学習者向けに設計された総合的なモバイルアプリケーションです。語彙の学習、かなの練習、文の分析などのツールを提供します。このアプリには、テキストファイル、PDF、またはOCRで物理的な文書をスキャンして、ユーザーが独自の学習セットを作成できる「カスタムモード」機能があります。

## ✨ 特徴

- **JLPT学習モード:** 日本語能力試験の準備をします。
- **かなクイズ:** ひらがなとカタカナを練習して習得します。
- **文の分析:** 日本語の文を分解して、文法と語彙を理解します。
- **カスタム学習セット:**
  - `.txt`ファイルから語彙をインポートします。
  - 自己ホスト型サーバー経由で`.pdf`ファイルから語彙をインポートします。
  - 自己ホスト型OCRサービスを使用して文書や画像をスキャンします。
  - 内蔵のフラッシュカードモードを使用して、カスタム生成された語彙を学習します。
- **ユーザーアカウントと進捗の同期:** サインインして、デバイス間で進捗を同期します（AWS Amplifyを利用）。

## 🛠️ 技術スタック

- **フロントエンド:** React Native with Expo
- **言語:** TypeScript
- **ルーティング:** Expo Router
- **バックエンド（クラウド）:** AWS Amplify（認証用のCognito、AppSync GraphQL API）
- **バックエンド（自己ホスト型）:** PDFおよびOCR処理用のPython Flaskサービス
- **ローカルデータベース:** Expo SQLite

## 🚀はじめに

開発およびテスト目的で、ローカルマシンでプロジェクトを起動して実行するための手順に従ってください。

### 前提条件

- Node.js（LTSバージョンを推奨）
- npmまたはyarn
- Expo CLI: `npm install -g expo-cli`
- AWS Amplify CLI: `npm install -g @aws-amplify/cli`
- バックエンドサービス用のPython 3.xおよび`pip`
- バックエンドサービスを実行するマシンに[Tesseract OCR Engine](https://tesseract-ocr.github.io/)がインストールされていること

### 1. リポジトリをクローンする

```bash
git clone <your-repository-url>
cd shutokun-re
```

### 2. フロントエンドの依存関係をインストールする

React Nativeアプリケーションに必要なNode.jsパッケージをインストールします。

```bash
npm install
```

### 3. AWS Amplifyバックエンドを構成する

このプロジェクトでは、クラウドバックエンドにAWS Amplifyを使用しています。バックエンド構成をローカル環境にプルする必要があります。

1.  **Amplifyを初期化する:**
    ```bash
    amplify init
    ```
    画面の指示に従います。AWSアカウントへの接続を求められます。

2.  **バックエンド定義をプルする:**
    ```bash
    amplify pull
    ```
    これにより、クラウドから最新のバックエンド定義がフェッチされ、`src/`ディレクトリに必要な`aws-exports.js`ファイルが生成されます。

### 4. 自己ホスト型バックエンドを構成して実行する

PDFおよびOCR抽出機能は、別のPythonサービスに依存しています。

**詳細なセットアップ手順については、サービスディレクトリ内のREADMEを参照してください:**
[`./pdf-extraction-service/README.md`](./pdf-extraction-service/README.md)

**クイックサマリー:**
1.  サーバー（Proxmox VMなど）でPythonサービスを実行します。
2.  スマートフォンから安全にアクセスする方法（Tailscaleなど）を設定します。
3.  コードエディタで`app/(tabs)/custom-mode.tsx`を開きます。
4.  `SERVER_IP`定数を見つけて、プレースホルダーをサーバーのIPアドレスに置き換えます。

    ```javascript
    // 変更前
    const SERVER_IP = '<YOUR_SERVER_IP>';

    // 変更後（例）
    const SERVER_IP = '100.101.102.103';
    ```

### 5. モバイルアプリを実行する

両方のバックエンドが構成されたら、モバイルアプリケーションを実行できます。

```bash
npx expo start
```

これにより、Metroバンドラーが起動します。その後、Expo Goアプリを使用して物理デバイスでアプリを実行するか、コンピューターのエミュレーター/シミュレーターで実行できます。
