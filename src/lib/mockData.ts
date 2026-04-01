import { User, App, Comment, SubscriptionPlan } from './types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    username: 'tanakataro',
    displayName: '田中太郎',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tanakataro',
    bio: 'フルスタックエンジニア。React / Next.js / Node.js が得意です。便利なツールを作るのが好き。',
    followers: 1240,
    following: 320,
    isVerified: true,
    isPro: true,
    joinedAt: '2023-04-01',
    github: 'tanakataro',
    twitter: 'tanakataro_dev',
    website: 'https://example.com',
    totalEarnings: 248000,
    totalDownloads: 3820,
  },
  {
    id: 'user2',
    username: 'suzukihana',
    displayName: '鈴木花',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suzukihana',
    bio: 'UIデザイナー兼フロントエンドエンジニア。美しいものを作るのが使命。',
    followers: 890,
    following: 210,
    isVerified: false,
    isPro: true,
    joinedAt: '2023-06-15',
    github: 'suzukihana',
    totalEarnings: 125000,
    totalDownloads: 1560,
  },
  {
    id: 'user3',
    username: 'yamadakenji',
    displayName: '山田健二',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yamadakenji',
    bio: 'AIエンジニア。機械学習とWebアプリを組み合わせた面白いものを作っています。',
    followers: 2100,
    following: 145,
    isVerified: true,
    isPro: true,
    joinedAt: '2022-11-20',
    github: 'yamadakenji',
    twitter: 'yamada_ai',
    totalEarnings: 520000,
    totalDownloads: 7200,
  },
  {
    id: 'user4',
    username: 'satomiyuki',
    displayName: '佐藤みゆき',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=satomiyuki',
    bio: 'ゲーム開発者。Unity と WebGL で遊んでいます。',
    followers: 650,
    following: 430,
    isVerified: false,
    isPro: false,
    joinedAt: '2024-01-10',
    github: 'satomiyuki',
    totalEarnings: 68000,
    totalDownloads: 950,
  },
];

export const mockApps: App[] = [
  {
    id: 'app1',
    title: 'DevTimer Pro - ポモドーロタイマー',
    description: 'エンジニア向けに最適化されたポモドーロタイマー。タスク管理・集中力向上に。',
    longDescription: `## DevTimer Pro とは

エンジニアの生産性を最大化するために設計されたポモドーロタイマーアプリです。

### 主な機能

- **カスタマイズ可能なタイマー**: 作業時間・休憩時間を自由に設定
- **タスク管理**: 今日のタスクリストを管理しながら作業
- **統計ダッシュボード**: 週次・月次の集中時間をグラフで可視化
- **Slack / Discord 連携**: 作業中はステータスを自動更新
- **ダークモード対応**: 目に優しいインターフェース

### 技術スタック

React 19 + TypeScript + Tailwind CSS で構築。PWA対応でオフラインでも使用可能です。

### 使い方

1. アプリをダウンロードしてブラウザで開く
2. タスクを追加する
3. タイマーをスタート！

フィードバックはいつでも歓迎です。`,
    thumbnail: 'https://picsum.photos/seed/devtimer/800/400',
    screenshots: [
      'https://picsum.photos/seed/devtimer1/1200/800',
      'https://picsum.photos/seed/devtimer2/1200/800',
      'https://picsum.photos/seed/devtimer3/1200/800',
    ],
    author: mockUsers[0],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'PWA'],
    category: 'productivity',
    tags: ['ポモドーロ', 'タイマー', '生産性', 'タスク管理'],
    pricing: 'paid',
    price: 980,
    currency: 'JPY',
    likes: 342,
    comments: 28,
    downloads: 1240,
    views: 8900,
    isLiked: false,
    isPurchased: false,
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2025-01-20T15:30:00Z',
    demoUrl: 'https://devtimer-demo.example.com',
    featured: true,
    trending: true,
  },
  {
    id: 'app2',
    title: 'ColorPalette AI - AIカラー提案ツール',
    description: 'AIがあなたのデザインに最適なカラーパレットを自動生成。デザイナー必携。',
    longDescription: `## ColorPalette AI

AIを活用したカラーパレット生成ツールです。画像をアップロードするか、テキストで雰囲気を入力するだけで、プロ品質のカラーパレットを瞬時に生成します。

### 機能

- 画像からカラー抽出
- テキストプロンプトからパレット生成
- アクセシビリティチェック (WCAG準拠)
- CSS / Tailwind / Figma 形式でエクスポート
- 500以上のプリセットパレット

### 使用技術

Next.js + Gemini API + Canvas API`,
    thumbnail: 'https://picsum.photos/seed/colorai/800/400',
    screenshots: [
      'https://picsum.photos/seed/colorai1/1200/800',
      'https://picsum.photos/seed/colorai2/1200/800',
    ],
    author: mockUsers[1],
    techStack: ['Next.js', 'Gemini API', 'Canvas API', 'TypeScript'],
    category: 'design',
    tags: ['カラー', 'AI', 'デザイン', 'パレット'],
    pricing: 'subscription',
    price: 0,
    currency: 'JPY',
    likes: 521,
    comments: 45,
    downloads: 2300,
    views: 15600,
    isLiked: true,
    isPurchased: false,
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2025-02-10T12:00:00Z',
    demoUrl: 'https://colorpalette-demo.example.com',
    featured: true,
    trending: true,
  },
  {
    id: 'app3',
    title: 'GitFlow Visualizer',
    description: 'Gitのブランチフローをリアルタイムで可視化。チーム開発を分かりやすく。',
    longDescription: `## GitFlow Visualizer

Gitリポジトリのブランチフローをインタラクティブに可視化するツールです。

### 特徴

- GitHub / GitLab 連携
- リアルタイムブランチ可視化
- マージフローのアニメーション表示
- チームメンバーの作業状況一覧
- PRのステータス表示

完全無料でオープンソースとして公開しています。`,
    thumbnail: 'https://picsum.photos/seed/gitflow/800/400',
    screenshots: [
      'https://picsum.photos/seed/gitflow1/1200/800',
    ],
    author: mockUsers[2],
    techStack: ['React', 'D3.js', 'GitHub API', 'WebSocket'],
    category: 'developer-tools',
    tags: ['Git', 'GitHub', '可視化', 'チーム開発'],
    pricing: 'free',
    price: 0,
    currency: 'JPY',
    likes: 876,
    comments: 92,
    downloads: 4500,
    views: 28000,
    isLiked: false,
    isPurchased: true,
    createdAt: '2024-09-20T14:00:00Z',
    updatedAt: '2025-01-05T11:00:00Z',
    sourceUrl: 'https://github.com/example/gitflow-visualizer',
    featured: false,
    trending: true,
  },
  {
    id: 'app4',
    title: 'PixelQuest - ブラウザRPG',
    description: 'ブラウザで遊べるレトロ風RPG。懐かしのドット絵で冒険しよう！',
    longDescription: `## PixelQuest

完全ブラウザで動作するレトロ風RPGゲームです。インストール不要でどこからでも遊べます。

### 特徴

- 10時間以上のシナリオ
- 50種類以上のモンスター
- オンラインマルチプレイ対応 (最大4人)
- セーブデータはクラウドに自動保存
- モバイル対応

### 技術

Phaser.js + WebSocket + Firebase で構築。`,
    thumbnail: 'https://picsum.photos/seed/pixelquest/800/400',
    screenshots: [
      'https://picsum.photos/seed/pixelquest1/1200/800',
      'https://picsum.photos/seed/pixelquest2/1200/800',
    ],
    author: mockUsers[3],
    techStack: ['Phaser.js', 'WebSocket', 'Firebase', 'TypeScript'],
    category: 'games',
    tags: ['RPG', 'ゲーム', 'ドット絵', 'マルチプレイ'],
    pricing: 'paid',
    price: 500,
    currency: 'JPY',
    likes: 234,
    comments: 67,
    downloads: 890,
    views: 5600,
    isLiked: false,
    isPurchased: false,
    createdAt: '2025-01-08T16:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z',
    demoUrl: 'https://pixelquest-demo.example.com',
    featured: false,
    trending: false,
  },
  {
    id: 'app5',
    title: 'AI Code Reviewer',
    description: 'AIがあなたのコードをレビュー。バグ・セキュリティ・パフォーマンスを自動チェック。',
    longDescription: `## AI Code Reviewer

Gemini APIを活用した高精度コードレビューツールです。

### できること

- バグの自動検出と修正提案
- セキュリティ脆弱性のスキャン
- パフォーマンス改善提案
- コーディングスタイルの統一チェック
- PR連携でコミットごとに自動レビュー

### 対応言語

TypeScript / JavaScript / Python / Go / Rust / Java / C++`,
    thumbnail: 'https://picsum.photos/seed/aireviewer/800/400',
    screenshots: [
      'https://picsum.photos/seed/aireviewer1/1200/800',
      'https://picsum.photos/seed/aireviewer2/1200/800',
      'https://picsum.photos/seed/aireviewer3/1200/800',
    ],
    author: mockUsers[2],
    techStack: ['Next.js', 'Gemini API', 'GitHub API', 'TypeScript'],
    category: 'developer-tools',
    tags: ['AIレビュー', 'コード品質', 'セキュリティ', 'GitHub'],
    pricing: 'subscription',
    price: 0,
    currency: 'JPY',
    likes: 1203,
    comments: 156,
    downloads: 6800,
    views: 42000,
    isLiked: true,
    isPurchased: false,
    createdAt: '2024-08-15T08:00:00Z',
    updatedAt: '2025-02-15T10:00:00Z',
    featured: true,
    trending: false,
  },
  {
    id: 'app6',
    title: 'BudgetFlow - 家計簿アプリ',
    description: 'シンプルで使いやすい家計簿アプリ。グラフで支出を可視化して節約を助けます。',
    longDescription: `## BudgetFlow

日常の収支管理をシンプルに。レシート撮影からAI自動入力まで対応。

### 機能

- レシート撮影＆AI自動入力
- カテゴリ別支出グラフ
- 月次・年次レポート
- 予算設定とアラート
- CSV エクスポート

無料プランでも基本機能は全て使えます。`,
    thumbnail: 'https://picsum.photos/seed/budgetflow/800/400',
    screenshots: [
      'https://picsum.photos/seed/budgetflow1/1200/800',
    ],
    author: mockUsers[0],
    techStack: ['React Native', 'Expo', 'Firebase', 'Gemini API'],
    category: 'finance',
    tags: ['家計簿', '節約', 'AI', 'レシート'],
    pricing: 'free',
    price: 0,
    currency: 'JPY',
    likes: 445,
    comments: 34,
    downloads: 3200,
    views: 18000,
    isLiked: false,
    isPurchased: true,
    createdAt: '2024-10-20T11:00:00Z',
    updatedAt: '2025-01-30T14:00:00Z',
    featured: false,
    trending: false,
  },
];

export const mockComments: Comment[] = [
  {
    id: 'comment1',
    appId: 'app1',
    author: mockUsers[1],
    content: '使ってみましたが最高です！タスク管理との連携が特に便利。',
    likes: 12,
    createdAt: '2025-01-25T10:00:00Z',
  },
  {
    id: 'comment2',
    appId: 'app1',
    author: mockUsers[2],
    content: 'Slack連携が地味に嬉しい機能ですね。チームに共有します！',
    likes: 8,
    createdAt: '2025-01-28T15:30:00Z',
  },
  {
    id: 'comment3',
    appId: 'app1',
    author: mockUsers[3],
    content: 'UIがシンプルで使いやすいです。統計グラフが特に気に入りました。',
    likes: 5,
    createdAt: '2025-02-01T09:15:00Z',
  },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan_monthly',
    name: 'スタンダード月額',
    price: 980,
    interval: 'monthly',
    features: [
      'サブスクリプション対応アプリが全て無制限に使用可能',
      '新着アプリへの優先アクセス',
      '広告なし',
      '月500円分のダウンロードクレジット付与',
      'クリエイターへのダイレクトメッセージ',
    ],
    recommended: false,
  },
  {
    id: 'plan_yearly',
    name: 'スタンダード年額',
    price: 7800,
    interval: 'yearly',
    features: [
      'サブスクリプション対応アプリが全て無制限に使用可能',
      '新着アプリへの優先アクセス',
      '広告なし',
      '毎月500円分のダウンロードクレジット付与',
      'クリエイターへのダイレクトメッセージ',
      '2ヶ月分お得 (月額換算 ¥650)',
    ],
    recommended: true,
  },
];

export const categories = [
  { id: 'all', label: 'すべて' },
  { id: 'productivity', label: '生産性' },
  { id: 'developer-tools', label: '開発ツール' },
  { id: 'design', label: 'デザイン' },
  { id: 'games', label: 'ゲーム' },
  { id: 'finance', label: 'ファイナンス' },
  { id: 'education', label: '教育' },
  { id: 'utilities', label: 'ユーティリティ' },
  { id: 'social', label: 'ソーシャル' },
];

export function formatPrice(price: number, pricing: string): string {
  if (pricing === 'free') return '無料';
  if (pricing === 'subscription') return 'サブスク対応';
  return `¥${price.toLocaleString()}`;
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return '今日';
  if (days === 1) return '昨日';
  if (days < 30) return `${days}日前`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}ヶ月前`;
  return `${Math.floor(months / 12)}年前`;
}
