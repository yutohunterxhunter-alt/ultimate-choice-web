import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeShare - コーダーのためのアプリ投稿SNS',
  description: 'エンジニアが作ったWebアプリを投稿・発見・購入できるプラットフォーム。無料から有料まで、あなたのコーディングライフを豊かにするアプリが集まる場所。',
  keywords: 'コーディング, アプリ, SNS, 開発者, プログラミング, 無料, 有料, サブスクリプション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
