import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              CodeShare
            </Link>
            <p className="text-sm leading-relaxed">
              エンジニアが作ったアプリを投稿・発見・購入できるプラットフォーム。
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">サービス</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/explore" className="hover:text-white transition-colors">アプリを探す</Link></li>
              <li><Link href="/post" className="hover:text-white transition-colors">アプリを投稿</Link></li>
              <li><Link href="/subscribe" className="hover:text-white transition-colors">サブスクリプション</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">クリエイターダッシュボード</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">サポート</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">ヘルプセンター</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">利用ガイド</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">お問い合わせ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">コミュニティ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">法的情報</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">利用規約</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">特定商取引法</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; 2025 CodeShare. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              1,240人のクリエイター
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              3,200以上のアプリ
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
