'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import { mockApps, mockUsers, categories } from '@/lib/mockData';

type FilterType = 'all' | 'trending' | 'recent' | 'free' | 'paid' | 'subscription';
type SortType = 'popular' | 'recent' | 'downloads' | 'price_asc' | 'price_desc';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('popular');
  const [activeTab, setActiveTab] = useState<'apps' | 'creators'>('apps');

  const filteredApps = mockApps
    .filter((app) => {
      const matchesSearch =
        !search ||
        app.title.toLowerCase().includes(search.toLowerCase()) ||
        app.description.toLowerCase().includes(search.toLowerCase()) ||
        app.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        app.techStack.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = activeCategory === 'all' || app.category === activeCategory;
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'trending' && app.trending) ||
        (activeFilter === 'recent' && true) ||
        (activeFilter === 'free' && app.pricing === 'free') ||
        (activeFilter === 'paid' && app.pricing === 'paid') ||
        (activeFilter === 'subscription' && app.pricing === 'subscription');
      return matchesSearch && matchesCategory && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.likes - a.likes;
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">探索する</h1>
          <p className="text-gray-500">エンジニアたちが作った面白いアプリを発見しよう</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="タイトル、タグ、技術スタックで検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 text-base bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-400 shadow-sm"
          />
          <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-4 w-5 h-5 text-gray-400 hover:text-gray-600">
              ✕
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {(['apps', 'creators'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'apps' ? `アプリ (${filteredApps.length})` : `クリエイター (${mockUsers.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'apps' && (
          <>
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex flex-wrap gap-2">
                {([
                  { id: 'all', label: 'すべて' },
                  { id: 'trending', label: '🔥 急上昇' },
                  { id: 'free', label: '🎁 無料' },
                  { id: 'paid', label: '💰 有料' },
                  { id: 'subscription', label: '⚡ サブスク' },
                ] as const).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      activeFilter === f.id
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:border-indigo-300"
              >
                <option value="popular">人気順</option>
                <option value="recent">新着順</option>
                <option value="downloads">ダウンロード数順</option>
                <option value="price_asc">価格: 安い順</option>
                <option value="price_desc">価格: 高い順</option>
              </select>
            </div>

            {/* Results */}
            {filteredApps.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredApps.map((app) => (
                  <AppCard key={app.id} app={app} variant="featured" />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <div className="text-xl font-semibold text-gray-700 mb-2">アプリが見つかりませんでした</div>
                <p className="text-gray-400">別のキーワードや条件で試してみてください</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'creators' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockUsers.map((user) => (
              <a key={user.id} href={`/profile/${user.username}`} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
                    {user.displayName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{user.displayName}</span>
                      {user.isVerified && (
                        <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">@{user.username}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{user.bio}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-bold text-gray-900">{user.followers.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">フォロワー</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{user.totalDownloads.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">DL数</div>
                  </div>
                  <div>
                    <div className="font-bold text-indigo-600">¥{Math.floor(user.totalEarnings / 10000)}万+</div>
                    <div className="text-xs text-gray-400">収益</div>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                  フォロー
                </button>
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
