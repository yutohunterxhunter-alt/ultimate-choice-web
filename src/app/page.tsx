import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import { mockApps, mockUsers, categories } from '@/lib/mockData';

export default function HomePage() {
  const featuredApps = mockApps.filter(a => a.featured);
  const trendingApps = mockApps.filter(a => a.trending);
  const recentApps = [...mockApps].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const freeApps = mockApps.filter(a => a.pricing === 'free');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              コーダーのためのアプリ投稿 SNS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              あなたが作ったアプリを<br />
              <span className="text-yellow-300">世界に届けよう</span>
            </h1>
            <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
              エンジニアが作ったWebアプリを投稿・発見・購入できるプラットフォーム。
              無料から有料まで、あなたのアイデアを収益化しよう。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full hover:bg-indigo-50 transition-colors shadow-lg"
              >
                アプリを探す
              </Link>
              <Link
                href="/post"
                className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-full hover:bg-white/30 transition-colors"
              >
                + アプリを投稿
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-around md:justify-start md:gap-12 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">3,200+</div>
              <div className="text-xs text-gray-500">公開アプリ</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200"></div>
            <div>
              <div className="text-2xl font-bold text-gray-900">1,240</div>
              <div className="text-xs text-gray-500">クリエイター</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200"></div>
            <div>
              <div className="text-2xl font-bold text-gray-900">42,000+</div>
              <div className="text-xs text-gray-500">ダウンロード</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200"></div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">¥980〜</div>
              <div className="text-xs text-gray-500">サブスク月額</div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-10 scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.id}`}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cat.id === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Featured Apps */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-indigo-600">⭐</span> 注目のアプリ
            </h2>
            <Link href="/explore?filter=featured" className="text-sm text-indigo-600 hover:underline">すべて見る →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredApps.map((app) => (
              <AppCard key={app.id} app={app} variant="featured" />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-10">
            {/* Trending */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🔥</span> 急上昇
                </h2>
                <Link href="/explore?filter=trending" className="text-sm text-indigo-600 hover:underline">すべて見る →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trendingApps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </section>

            {/* Recent */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🆕</span> 新着
                </h2>
                <Link href="/explore?filter=recent" className="text-sm text-indigo-600 hover:underline">すべて見る →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentApps.slice(0, 4).map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </section>

            {/* Free Apps */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🎁</span> 無料アプリ
                </h2>
                <Link href="/explore?filter=free" className="text-sm text-indigo-600 hover:underline">すべて見る →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {freeApps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Subscription CTA */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
              <div className="text-lg font-bold mb-2">サブスクリプション</div>
              <p className="text-sm text-indigo-100 mb-4">月 ¥980 で全サブスク対応アプリが使い放題！</p>
              <Link href="/subscribe" className="block text-center py-2 bg-white text-indigo-600 font-semibold rounded-full text-sm hover:bg-indigo-50 transition-colors">
                詳細を見る
              </Link>
            </div>

            {/* Popular Creators */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">人気クリエイター</h3>
              <div className="space-y-3">
                {mockUsers.slice(0, 4).map((user, index) => (
                  <Link key={user.id} href={`/profile/${user.username}`} className="flex items-center gap-3 group">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600">
                      {user.displayName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate">{user.displayName}</span>
                        {user.isVerified && (
                          <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{user.followers.toLocaleString()} フォロワー</div>
                    </div>
                    <span className="text-xs text-gray-300">#{index + 1}</span>
                  </Link>
                ))}
              </div>
              <Link href="/explore?tab=creators" className="mt-4 block text-center text-sm text-indigo-600 hover:underline">
                もっと見る →
              </Link>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">人気タグ</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'TypeScript', 'AI', 'Firebase', 'Tailwind', 'ゲーム', 'ツール', 'API', 'PWA'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/explore?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Start creating CTA */}
            <div className="bg-gray-900 rounded-2xl p-5 text-white">
              <div className="text-lg font-bold mb-2">あなたも投稿しよう</div>
              <p className="text-sm text-gray-400 mb-4">作ったアプリを投稿して収益化。無料でアカウント作成できます。</p>
              <Link href="/post" className="block text-center py-2 bg-indigo-600 text-white font-semibold rounded-full text-sm hover:bg-indigo-700 transition-colors">
                投稿を始める
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
