'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { categories } from '@/lib/mockData';
import { getApps, getTopCreators, AppDoc } from '@/lib/firestore';

function AppCardFS({ app }: { app: AppDoc }) {
  const pricingBadge = app.pricing === 'free'
    ? <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-medium">無料</span>
    : app.pricing === 'subscription'
    ? <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">サブスク</span>
    : <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full font-medium">¥{app.price.toLocaleString()}</span>;

  return (
    <Link href={`/app/${app.id}`} className="block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all group">
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {app.thumbnailUrl ? (
          <img src={app.thumbnailUrl} alt={app.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-indigo-50">
            {app.category === 'games' ? '🎮' : app.category === 'productivity' ? '⚡' : '💻'}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{app.title}</h3>
          {pricingBadge}
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{app.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-medium text-gray-600">@{app.authorUsername}</span>
          <div className="flex items-center gap-3">
            <span>♥ {app.likes}</span>
            <span>↓ {app.downloads}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface Creator {
  uid: string;
  displayName?: string;
  username?: string;
  followers?: number;
  photoURL?: string;
  isVerified?: boolean;
}

export default function HomePage() {
  const [recentApps, setRecentApps] = useState<AppDoc[]>([]);
  const [popularApps, setPopularApps] = useState<AppDoc[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [recent, popular, topCreators] = await Promise.all([
        getApps({ orderField: 'createdAt', limitCount: 8 }),
        getApps({ orderField: 'likes', limitCount: 6 }),
        getTopCreators(4),
      ]);
      setRecentApps(recent);
      setPopularApps(popular);
      setCreators(topCreators as Creator[]);
      setLoading(false);
    }
    load();
  }, []);

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
              <div className="text-2xl font-bold text-gray-900">{recentApps.length}+</div>
              <div className="text-xs text-gray-500">公開アプリ</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200"></div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{creators.length}+</div>
              <div className="text-xs text-gray-500">クリエイター</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200"></div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">Free</div>
              <div className="text-xs text-gray-500">無料で始める</div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-10">
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

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p>読み込み中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-10">
              {/* Popular */}
              {popularApps.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-indigo-600">⭐</span> 人気アプリ
                    </h2>
                    <Link href="/explore?filter=popular" className="text-sm text-indigo-600 hover:underline">すべて見る →</Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {popularApps.slice(0, 4).map((app) => (
                      <AppCardFS key={app.id} app={app} />
                    ))}
                  </div>
                </section>
              )}

              {/* Recent */}
              {recentApps.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span>🆕</span> 新着
                    </h2>
                    <Link href="/explore" className="text-sm text-indigo-600 hover:underline">すべて見る →</Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recentApps.map((app) => (
                      <AppCardFS key={app.id} app={app} />
                    ))}
                  </div>
                </section>
              )}

              {/* Empty state */}
              {recentApps.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">まだアプリがありません</h3>
                  <p className="text-gray-500 mb-6">最初のアプリを投稿してみよう！</p>
                  <Link
                    href="/post"
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors"
                  >
                    アプリを投稿する
                  </Link>
                </div>
              )}
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
              {creators.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4">人気クリエイター</h3>
                  <div className="space-y-3">
                    {creators.map((creator, index) => (
                      <Link key={creator.uid} href={`/profile/${creator.username}`} className="flex items-center gap-3 group">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600 overflow-hidden">
                          {creator.photoURL
                            ? <img src={creator.photoURL} alt="" className="w-full h-full object-cover" />
                            : (creator.displayName?.[0] || '?')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate">{creator.displayName}</span>
                            {creator.isVerified && (
                              <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">{(creator.followers || 0).toLocaleString()} フォロワー</div>
                        </div>
                        <span className="text-xs text-gray-300">#{index + 1}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

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
        )}
      </main>

      <Footer />
    </div>
  );
}
