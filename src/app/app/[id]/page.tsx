'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApp, getComments, toggleLike, isLiked, addComment, AppDoc, CommentDoc, getApps } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

function timeAgo(ts: { seconds: number } | null): string {
  if (!ts) return '';
  const d = new Date(ts.seconds * 1000);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'たった今';
  if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
  return `${Math.floor(diff / 86400)}日前`;
}

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [app, setApp] = useState<AppDoc | null>(null);
  const [comments, setComments] = useState<CommentDoc[]>([]);
  const [relatedApps, setRelatedApps] = useState<AppDoc[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'comments'>('overview');
  const [commentText, setCommentText] = useState('');
  const [screenshotIdx, setScreenshotIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    async function load() {
      const [appData, commentsData] = await Promise.all([
        getApp(id),
        getComments(id),
      ]);
      if (!appData) { router.push('/'); return; }
      setApp(appData);
      setLikeCount(appData.likes);
      setComments(commentsData);
      // Related apps
      const related = await getApps({ category: appData.category, limitCount: 4 });
      setRelatedApps(related.filter(a => a.id !== id).slice(0, 3));
      setLoading(false);
    }
    load();
  }, [params.id, router]);

  useEffect(() => {
    if (user && app) {
      isLiked(app.id, user.uid).then(setLiked);
    }
  }, [user, app]);

  const handleLike = async () => {
    if (!user) { router.push('/login'); return; }
    const nowLiked = await toggleLike(app!.id, user.uid);
    setLiked(nowLiked);
    setLikeCount(c => nowLiked ? c + 1 : c - 1);
  };

  const handleComment = async () => {
    if (!user || !profile) { router.push('/login'); return; }
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    const newComment = await addComment(app!.id, commentText.trim(), {
      uid: user.uid,
      username: profile.username,
      displayName: profile.displayName,
      photoURL: profile.photoURL || '',
    });
    setComments(prev => [newComment, ...prev]);
    setCommentText('');
    setSubmittingComment(false);
  };

  const pricingLabel = () => {
    if (!app) return '';
    if (app.pricing === 'free') return '無料でダウンロード';
    if (app.pricing === 'subscription') return 'サブスクで使い放題';
    return `¥${app.price.toLocaleString()} で購入`;
  };

  const pricingColor = () => {
    if (!app) return '';
    if (app.pricing === 'free') return 'bg-green-600 hover:bg-green-700';
    if (app.pricing === 'subscription') return 'bg-purple-600 hover:bg-purple-700';
    return 'bg-indigo-600 hover:bg-indigo-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!app) return null;

  const images = app.screenshotUrls?.length ? app.screenshotUrls : (app.thumbnailUrl ? [app.thumbnailUrl] : []);

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
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
              {/* Screenshot viewer */}
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {images[screenshotIdx] ? (
                  <img src={images[screenshotIdx]} alt={app.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl bg-indigo-50">💻</div>
                )}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setScreenshotIdx(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${i === screenshotIdx ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setScreenshotIdx(Math.max(0, screenshotIdx - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">‹</button>
                    <button onClick={() => setScreenshotIdx(Math.min(images.length - 1, screenshotIdx + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">›</button>
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
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{app.title}</h1>
                    <p className="text-gray-500">{app.description}</p>
                  </div>
                </div>

                {/* Author */}
                <Link href={`/profile/${app.authorUsername}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                    {app.authorPhotoURL
                      ? <img src={app.authorPhotoURL} alt="" className="w-full h-full object-cover" />
                      : app.authorDisplayName[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{app.authorDisplayName}</div>
                    <div className="text-xs text-gray-500">@{app.authorUsername}</div>
                  </div>
                </Link>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'いいね', value: likeCount.toLocaleString(), icon: '♥' },
                    { label: 'コメント', value: comments.length, icon: '💬' },
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
                {app.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {app.techStack.map((tech) => (
                      <span key={tech} className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-full font-medium">{tech}</span>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {app.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {app.tags.map((tag) => (
                      <Link key={tag} href={`/explore?tag=${encodeURIComponent(tag)}`} className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {(['overview', 'comments'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}>
                  {tab === 'overview' ? '概要' : `コメント (${comments.length})`}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="prose prose-sm max-w-none">
                  {app.longDescription?.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3 first:mt-0">{line.replace('## ', '')}</h2>;
                    if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-gray-900 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                    if (line.startsWith('- ')) return <div key={i} className="flex items-start gap-2 mb-2"><span className="text-indigo-600 mt-0.5">•</span><p className="text-gray-700">{line.replace('- ', '')}</p></div>;
                    if (line === '') return <div key={i} className="mb-2"></div>;
                    return <p key={i} className="text-gray-700 mb-2">{line}</p>;
                  })}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-400">
                  投稿日: {app.createdAt ? new Date(app.createdAt.seconds * 1000).toLocaleDateString('ja-JP') : '—'}
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-4">
                {/* Comment form */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  {user ? (
                    <>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="コメントを書く..."
                        rows={3}
                        className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-indigo-300 focus:bg-white transition-colors"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleComment}
                          disabled={!commentText.trim() || submittingComment}
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                          {submittingComment ? '投稿中...' : '投稿する'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-3">コメントするにはログインが必要です</p>
                      <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700">ログイン</Link>
                    </div>
                  )}
                </div>
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-600 overflow-hidden">
                        {comment.authorPhotoURL
                          ? <img src={comment.authorPhotoURL} alt="" className="w-full h-full object-cover" />
                          : comment.authorDisplayName[0]}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{comment.authorDisplayName}</div>
                        <div className="text-xs text-gray-400">{timeAgo(comment.createdAt as { seconds: number } | null)}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div className="text-center py-12 text-gray-400">まだコメントがありません。最初のコメントを投稿しよう！</div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-20">
              <div className="text-center mb-5">
                {app.pricing === 'free' && <div className="text-3xl font-bold text-green-600 mb-1">無料</div>}
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

              <div className="space-y-2">
                {app.pricing === 'subscription' ? (
                  <Link href="/subscribe" className="block text-center py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors">
                    サブスクに登録する
                  </Link>
                ) : (
                  <button className={`w-full py-3 text-white font-semibold rounded-full transition-colors ${pricingColor()}`}>
                    {pricingLabel()}
                  </button>
                )}
                {app.demoUrl && (
                  <a href={app.demoUrl} target="_blank" rel="noopener noreferrer" className="block text-center py-2.5 text-sm text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                    デモを試す
                  </a>
                )}
                {app.sourceUrl && (
                  <a href={app.sourceUrl} target="_blank" rel="noopener noreferrer" className="block text-center py-2.5 text-sm text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                    ソースを見る (GitHub)
                  </a>
                )}
              </div>

              <div className="border-t border-gray-100 mt-5 pt-5">
                <button
                  onClick={handleLike}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-full border transition-colors text-sm font-medium ${
                    liked ? 'border-pink-300 bg-pink-50 text-pink-600' : 'border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  いいね {likeCount.toLocaleString()}
                </button>
              </div>
            </div>

            {/* Related Apps */}
            {relatedApps.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-4">関連アプリ</h3>
                <div className="space-y-3">
                  {relatedApps.map((relApp) => (
                    <Link key={relApp.id} href={`/app/${relApp.id}`} className="flex gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors">
                      <div className="w-12 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {relApp.thumbnailUrl
                          ? <img src={relApp.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-lg">💻</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{relApp.title}</div>
                        <div className="text-xs text-gray-400 line-clamp-1">{relApp.description}</div>
                      </div>
                    </Link>
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
