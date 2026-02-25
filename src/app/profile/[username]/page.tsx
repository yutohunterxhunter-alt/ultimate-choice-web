'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import { mockUsers, mockApps } from '@/lib/mockData';

export default function ProfilePage() {
  const params = useParams();
  const user = mockUsers.find(u => u.username === params.username) || mockUsers[0];
  const userApps = mockApps.filter(a => a.author.id === user.id);
  const [followed, setFollowed] = useState(false);
  const [activeTab, setActiveTab] = useState<'apps' | 'likes'>('apps');

  const likedApps = mockApps.filter(a => a.isLiked);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Profile Header Banner */}
      <div className="h-32 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700"></div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Info */}
        <div className="relative -mt-12 mb-6">
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-indigo-600 bg-indigo-100">
                {user.displayName[0]}
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{user.displayName}</h1>
                  {user.isVerified && (
                    <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {user.isPro && (
                    <span className="px-2 py-0.5 text-xs font-bold text-yellow-700 bg-yellow-100 rounded-full">PRO</span>
                  )}
                </div>
                <div className="text-gray-500">@{user.username}</div>
              </div>
            </div>
            <div className="pb-2 flex gap-2">
              <button
                onClick={() => setFollowed(!followed)}
                className={`px-5 py-2 text-sm font-semibold rounded-full transition-colors ${
                  followed
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {followed ? 'フォロー中' : 'フォロー'}
              </button>
              <button className="px-3 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                ···
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-6">
          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Bio */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-700 leading-relaxed">{user.bio}</p>
              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(user.joinedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })} 参加
                </div>
                {user.github && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
                      {user.github}
                    </a>
                  </div>
                )}
                {user.twitter && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
                      @{user.twitter}
                    </a>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 truncate">
                      {user.website.replace('https://', '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{user.followers.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-0.5">フォロワー</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{user.following.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-0.5">フォロー中</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{userApps.length}</div>
                  <div className="text-xs text-gray-400 mt-0.5">投稿数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{user.totalDownloads.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-0.5">総DL数</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex border-b border-gray-200 mb-6">
              {(['apps', 'likes'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'apps' ? `投稿アプリ (${userApps.length})` : `いいね (${likedApps.length})`}
                </button>
              ))}
            </div>

            {activeTab === 'apps' && (
              userApps.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {userApps.map(app => (
                    <AppCard key={app.id} app={app} variant="featured" />
                  ))}
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
                  {likedApps.map(app => (
                    <AppCard key={app.id} app={app} variant="featured" />
                  ))}
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
