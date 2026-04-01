'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getUserByUsername, getAppsByAuthor, getLikedAppIds, getApps, isFollowing, toggleFollow, AppDoc } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface UserData {
  uid: string;
  username: string;
  displayName: string;
  bio: string;
  photoURL: string;
  github: string;
  twitter: string;
  website: string;
  followers: number;
  following: number;
  totalDownloads: number;
  isVerified: boolean;
  isPro: boolean;
  createdAt: { seconds: number } | string;
}

function AppMiniCard({ app }: { app: AppDoc }) {
  return (
    <Link href={`/app/${app.id}`} className="block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all group">
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {app.thumbnailUrl
          ? <img src={app.thumbnailUrl} alt={app.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-3xl bg-indigo-50">💻</div>}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors mb-1">{app.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{app.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>♥ {app.likes}</span>
          <span>↓ {app.downloads}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userApps, setUserApps] = useState<AppDoc[]>([]);
  const [likedApps, setLikedApps] = useState<AppDoc[]>([]);
  const [followed, setFollowed] = useState(false);
  const [activeTab, setActiveTab] = useState<'apps' | 'likes'>('apps');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = params.username as string;
    async function load() {
      const u = await getUserByUsername(username);
      if (!u) { setLoading(false); return; }
      const typedUser = u as UserData;
      setUserData(typedUser);
      const apps = await getAppsByAuthor(typedUser.uid);
      setUserApps(apps);
      setLoading(false);
    }
    load();
  }, [params.username]);

  useEffect(() => {
    if (userData && user) {
      isFollowing(user.uid, userData.uid).then(setFollowed);
    }
  }, [userData, user]);

  const loadLikedApps = async () => {
    if (!userData) return;
    if (likedApps.length > 0) return; // already loaded
    const likedIds = await getLikedAppIds(userData.uid);
    if (likedIds.length === 0) { setLikedApps([]); return; }
    const all = await getApps({ limitCount: 50 });
    setLikedApps(all.filter(a => likedIds.includes(a.id)));
  };

  const handleFollow = async () => {
    if (!user || !userData) return;
    const nowFollowing = await toggleFollow(user.uid, userData.uid);
    setFollowed(nowFollowing);
    setUserData(prev => prev ? {
      ...prev,
      followers: nowFollowing ? prev.followers + 1 : prev.followers - 1
    } : null);
  };

  const createdAt = userData?.createdAt
    ? typeof userData.createdAt === 'string'
      ? new Date(userData.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })
      : new Date((userData.createdAt as { seconds: number }).seconds * 1000).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })
    : '';

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

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-40 text-gray-400">
          <div className="text-5xl mb-4">👤</div>
          <p>ユーザーが見つかりません</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="h-32 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700"></div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="relative -mt-12 mb-6">
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                {userData.photoURL
                  ? <img src={userData.photoURL} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-indigo-600 bg-indigo-100">{userData.displayName[0]}</div>}
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{userData.displayName}</h1>
                  {userData.isVerified && (
                    <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {userData.isPro && <span className="px-2 py-0.5 text-xs font-bold text-yellow-700 bg-yellow-100 rounded-full">PRO</span>}
                </div>
                <div className="text-gray-500">@{userData.username}</div>
              </div>
            </div>
            <div className="pb-2 flex gap-2">
              {user && user.uid !== userData.uid && (
                <button
                  onClick={handleFollow}
                  className={`px-5 py-2 text-sm font-semibold rounded-full transition-colors ${
                    followed ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {followed ? 'フォロー中' : 'フォロー'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-6">
          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-700 leading-relaxed">{userData.bio || 'まだ自己紹介がありません'}</p>
              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {createdAt} 参加
                </div>
                {userData.github && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <a href={`https://github.com/${userData.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 truncate">{userData.github}</a>
                  </div>
                )}
                {userData.twitter && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <a href={`https://twitter.com/${userData.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">@{userData.twitter}</a>
                  </div>
                )}
                {userData.website && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <a href={userData.website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 truncate">{userData.website.replace('https://', '')}</a>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{userData.followers.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-0.5">フォロワー</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{userData.following.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-0.5">フォロー中</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{userApps.length}</div>
                  <div className="text-xs text-gray-400 mt-0.5">投稿数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{userData.totalDownloads.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-0.5">総DL数</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex border-b border-gray-200 mb-6">
              {(['apps', 'likes'] as const).map((tab) => (
                <button key={tab} onClick={() => { setActiveTab(tab); if (tab === 'likes') loadLikedApps(); }}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}>
                  {tab === 'apps' ? `投稿アプリ (${userApps.length})` : 'いいね'}
                </button>
              ))}
            </div>

            {activeTab === 'apps' && (
              userApps.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {userApps.map(app => <AppMiniCard key={app.id} app={app} />)}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <div className="text-5xl mb-4">📭</div>
                  <div className="text-lg font-medium">まだアプリが投稿されていません</div>
                </div>
              )
            )}

            {activeTab === 'likes' && (
              likedApps.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {likedApps.map(app => <AppMiniCard key={app.id} app={app} />)}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <div className="text-5xl mb-4">♥</div>
                  <div className="text-lg font-medium">いいねしたアプリはありません</div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
