'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import { mockApps, mockComments, formatPrice, timeAgo } from '@/lib/mockData';

export default function AppDetailPage() {
  const params = useParams();
  const app = mockApps.find(a => a.id === params.id) || mockApps[0];
  const comments = mockComments.filter(c => c.appId === app.id);
  const relatedApps = mockApps.filter(a => a.id !== app.id && a.category === app.category).slice(0, 3);

  const [liked, setLiked] = useState(app.isLiked);
  const [likeCount, setLikeCount] = useState(app.likes);
  const [purchased, setPurchased] = useState(app.isPurchased);
  const [activeTab, setActiveTab] = useState<'overview' | 'comments'>('overview');
  const [commentText, setCommentText] = useState('');
  const [screenshotIdx, setScreenshotIdx] = useState(0);

  const handlePurchase = () => {
    if (app.pricing === 'free') {
      setPurchased(true);
    } else if (app.pricing === 'paid') {
      setPurchased(true);
    }
  };

  const pricingLabel = () => {
    if (app.pricing === 'free') return '無料でダウンロード';
    if (app.pricing === 'subscription') return 'サブスクで使い放題';
    return `¥${app.price.toLocaleString()} で購入`;
  };

  const pricingColor = () => {
    if (app.pricing === 'free') return 'bg-green-600 hover:bg-green-700';
    if (app.pricing === 'subscription') return 'bg-purple-600 hover:bg-purple-700';
    return 'bg-indigo-600 hover:bg-indigo-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-indigo-600">ホーム</Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-indigo-600">探索</Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-xs">{app.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* App Header */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
              {/* Thumbnail/Screenshot viewer */}
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                <img
                  src={app.screenshots[screenshotIdx] || app.thumbnail}
                  alt={app.title}
                  className="w-full h-full object-cover"
                />
                {app.screenshots.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {app.screenshots.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setScreenshotIdx(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${i === screenshotIdx ? 'bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                )}
                {app.screenshots.length > 1 && (
                  <>
                    <button
                      onClick={() => setScreenshotIdx(Math.max(0, screenshotIdx - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setScreenshotIdx(Math.min(app.screenshots.length - 1, screenshotIdx + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full capitalize">
                        {app.category.replace('-', ' ')}
                      </span>
                      {app.trending && <span className="px-2.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">🔥 急上昇</span>}
                      {app.featured && <span className="px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full">⭐ 注目</span>}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{app.title}</h1>
                    <p className="text-gray-500">{app.description}</p>
                  </div>
                </div>

                {/* Author */}
                <Link href={`/profile/${app.author.username}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {app.author.displayName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900">{app.author.displayName}</span>
                      {app.author.isVerified && (
                        <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">@{app.author.username} · {app.author.followers.toLocaleString()} フォロワー</div>
                  </div>
                  <button className="ml-auto px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                    フォロー
                  </button>
                </Link>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'いいね', value: likeCount.toLocaleString(), icon: '♥' },
                    { label: 'ダウンロード', value: app.downloads.toLocaleString(), icon: '↓' },
                    { label: 'コメント', value: app.comments, icon: '💬' },
                    { label: '閲覧数', value: app.views.toLocaleString(), icon: '👁' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="text-lg">{stat.icon}</div>
                      <div className="font-bold text-gray-900 text-sm">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {app.techStack.map((tech) => (
                    <span key={tech} className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-full font-medium">{tech}</span>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {app.tags.map((tag) => (
                    <Link key={tag} href={`/explore?tag=${encodeURIComponent(tag)}`} className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {(['overview', 'comments'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'overview' ? '概要' : `コメント (${comments.length})`}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="prose prose-sm max-w-none">
                  {app.longDescription.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3 first:mt-0">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={i} className="text-lg font-semibold text-gray-900 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('- **')) {
                      const parts = line.replace('- **', '').split('**:');
                      return (
                        <div key={i} className="flex items-start gap-2 mb-2">
                          <span className="text-indigo-600 mt-0.5">•</span>
                          <p className="text-gray-700"><strong>{parts[0]}</strong>{parts[1] || ''}</p>
                        </div>
                      );
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <div key={i} className="flex items-start gap-2 mb-2">
                          <span className="text-indigo-600 mt-0.5">•</span>
                          <p className="text-gray-700">{line.replace('- ', '')}</p>
                        </div>
                      );
                    }
                    if (line === '') return <div key={i} className="mb-2"></div>;
                    return <p key={i} className="text-gray-700 mb-2">{line}</p>;
                  })}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-sm text-gray-400">
                    投稿日: {new Date(app.createdAt).toLocaleDateString('ja-JP')} ·
                    更新日: {new Date(app.updatedAt).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-4">
                {/* Comment form */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="コメントを書く..."
                    rows={3}
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-indigo-300 focus:bg-white transition-colors"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => setCommentText('')}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      disabled={!commentText.trim()}
                    >
                      投稿する
                    </button>
                  </div>
                </div>
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-600">
                        {comment.author.displayName[0]}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{comment.author.displayName}</div>
                        <div className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                    <button className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-pink-500 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {comment.likes}
                    </button>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    まだコメントがありません。最初のコメントを投稿しよう！
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Purchase Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-20">
              <div className="text-center mb-5">
                {app.pricing === 'free' && (
                  <div className="text-3xl font-bold text-green-600 mb-1">無料</div>
                )}
                {app.pricing === 'paid' && (
                  <>
                    <div className="text-3xl font-bold text-gray-900 mb-1">¥{app.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">買い切り</div>
                  </>
                )}
                {app.pricing === 'subscription' && (
                  <>
                    <div className="text-3xl font-bold text-purple-600 mb-1">サブスク</div>
                    <div className="text-xs text-gray-400">月額 ¥980 で使い放題</div>
                  </>
                )}
              </div>

              {purchased ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 py-2 text-sm text-green-600 bg-green-50 rounded-full">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    購入済み
                  </div>
                  <button className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors">
                    ダウンロード / 起動
                  </button>
                  {app.sourceUrl && (
                    <a href={app.sourceUrl} target="_blank" rel="noopener noreferrer" className="block text-center py-2 text-sm text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                      ソースを見る (GitHub)
                    </a>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {app.pricing === 'subscription' ? (
                    <Link href="/subscribe" className="block text-center py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors">
                      サブスクに登録する
                    </Link>
                  ) : (
                    <button
                      onClick={handlePurchase}
                      className={`w-full py-3 text-white font-semibold rounded-full transition-colors ${pricingColor()}`}
                    >
                      {pricingLabel()}
                    </button>
                  )}
                  {app.demoUrl && (
                    <a href={app.demoUrl} target="_blank" rel="noopener noreferrer" className="block text-center py-2.5 text-sm text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                      デモを試す
                    </a>
                  )}
                </div>
              )}

              <div className="border-t border-gray-100 mt-5 pt-5 space-y-3">
                <button
                  onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1); }}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-full border transition-colors text-sm font-medium ${
                    liked ? 'border-pink-300 bg-pink-50 text-pink-600' : 'border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  いいね {likeCount.toLocaleString()}
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  シェアする
                </button>
              </div>
            </div>

            {/* Related Apps */}
            {relatedApps.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-4">関連アプリ</h3>
                <div className="space-y-1">
                  {relatedApps.map((relApp) => (
                    <AppCard key={relApp.id} app={relApp} variant="compact" />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
