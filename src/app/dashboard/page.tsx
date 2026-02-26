'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAppsByAuthor, deleteApp, updateUserProfile, AppDoc } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const router = useRouter();
  const [myApps, setMyApps] = useState<AppDoc[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'settings'>('overview');
  const [loadingApps, setLoadingApps] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const [profileForm, setProfileForm] = useState({
    displayName: '',
    bio: '',
    github: '',
    twitter: '',
    website: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        github: profile.github || '',
        twitter: profile.twitter || '',
        website: profile.website || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    getAppsByAuthor(user.uid).then(apps => {
      setMyApps(apps);
      setLoadingApps(false);
    });
  }, [user]);

  const handleDeleteApp = async (appId: string) => {
    if (!confirm('このアプリを削除しますか？')) return;
    await deleteApp(appId);
    setMyApps(prev => prev.filter(a => a.id !== appId));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    await updateUserProfile(user.uid, profileForm);
    await refreshProfile();
    setSaveMsg('保存しました！');
    setSavingProfile(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const totalLikes = myApps.reduce((s, a) => s + a.likes, 0);
  const totalDownloads = myApps.reduce((s, a) => s + a.downloads, 0);

  if (authLoading) {
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

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">クリエイターダッシュボード</h1>
            <p className="text-gray-500 mt-1">こんにちは、{profile.displayName}さん</p>
          </div>
          <Link href="/post" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors">
            + 新しいアプリを投稿
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-8">
          {([
            { id: 'overview', label: '概要' },
            { id: 'apps', label: `マイアプリ (${myApps.length})` },
            { id: 'settings', label: '設定' },
          ] as const).map(({ id, label }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: '投稿アプリ数', value: myApps.length.toString(), icon: '📦', bg: 'bg-blue-50', text: 'text-blue-600' },
                { label: '総いいね数', value: totalLikes.toLocaleString(), icon: '♥', bg: 'bg-pink-50', text: 'text-pink-600' },
                { label: '総ダウンロード数', value: totalDownloads.toLocaleString(), icon: '↓', bg: 'bg-green-50', text: 'text-green-600' },
                { label: 'フォロワー', value: profile.followers.toLocaleString(), icon: '👥', bg: 'bg-purple-50', text: 'text-purple-600' },
              ].map((stat) => (
                <div key={stat.label} className={`${stat.bg} rounded-2xl p-5`}>
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className={`text-2xl font-bold ${stat.text}`}>{stat.value}</div>
                  <div className="text-sm font-medium text-gray-700 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {myApps.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-900">投稿アプリのパフォーマンス</h3>
                  <button onClick={() => setActiveTab('apps')} className="text-sm text-indigo-600 hover:underline">すべて見る →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-gray-100">
                        <th className="pb-3 font-semibold text-gray-500">アプリ名</th>
                        <th className="pb-3 font-semibold text-gray-500 text-right">価格</th>
                        <th className="pb-3 font-semibold text-gray-500 text-right">DL数</th>
                        <th className="pb-3 font-semibold text-gray-500 text-right">いいね</th>
                        <th className="pb-3 font-semibold text-gray-500 text-right">閲覧数</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {myApps.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3">
                            <Link href={`/app/${app.id}`} className="font-medium text-gray-900 hover:text-indigo-600 line-clamp-1">{app.title}</Link>
                          </td>
                          <td className="py-3 text-right">
                            {app.pricing === 'free'
                              ? <span className="text-green-600">無料</span>
                              : app.pricing === 'subscription'
                              ? <span className="text-purple-600">サブスク</span>
                              : <span className="text-orange-600">¥{app.price.toLocaleString()}</span>}
                          </td>
                          <td className="py-3 text-right text-gray-600">{app.downloads.toLocaleString()}</td>
                          <td className="py-3 text-right text-gray-600">{app.likes.toLocaleString()}</td>
                          <td className="py-3 text-right text-gray-600">{app.views.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {myApps.length === 0 && !loadingApps && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">まだアプリを投稿していません</h3>
                <p className="text-gray-500 mb-6">最初のアプリを投稿してみよう！</p>
                <Link href="/post" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors">
                  アプリを投稿する
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Apps Tab */}
        {activeTab === 'apps' && (
          <div className="space-y-4">
            {loadingApps ? (
              <div className="text-center py-20 text-gray-400">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p>読み込み中...</p>
              </div>
            ) : myApps.length > 0 ? (
              <>
                {myApps.map((app) => (
                  <div key={app.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex gap-4">
                      <div className="w-20 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {app.thumbnailUrl
                          ? <img src={app.thumbnailUrl} alt={app.title} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-2xl">💻</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link href={`/app/${app.id}`} className="font-semibold text-gray-900 hover:text-indigo-600 line-clamp-1">{app.title}</Link>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => handleDeleteApp(app.id)} className="px-3 py-1 text-xs text-red-500 border border-red-100 rounded-full hover:bg-red-50">削除</button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{app.description}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-400">
                          <span>♥ {app.likes.toLocaleString()}</span>
                          <span>↓ {app.downloads.toLocaleString()} DL</span>
                          <span>👁 {app.views.toLocaleString()} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/post" className="flex items-center justify-center gap-2 p-5 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                  <span className="text-xl">+</span>
                  <span className="font-medium">新しいアプリを投稿する</span>
                </Link>
              </>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">📭</div>
                <div className="text-lg font-medium mb-4">まだアプリがありません</div>
                <Link href="/post" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors">投稿する</Link>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-5">プロフィール設定</h3>
              {saveMsg && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">{saveMsg}</div>
              )}
              <div className="space-y-4">
                {[
                  { label: '表示名', key: 'displayName', type: 'text', placeholder: '' },
                  { label: '自己紹介', key: 'bio', type: 'textarea', placeholder: 'あなたについて教えてください' },
                  { label: 'GitHub', key: 'github', type: 'text', placeholder: 'username' },
                  { label: 'Twitter / X', key: 'twitter', type: 'text', placeholder: 'username' },
                  { label: 'ウェブサイト', key: 'website', type: 'text', placeholder: 'https://example.com' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={profileForm[field.key as keyof typeof profileForm]}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 resize-none text-sm"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={profileForm[field.key as keyof typeof profileForm]}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 text-sm"
                      />
                    )}
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ユーザーネーム</label>
                  <input type="text" value={profile.username} disabled className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 text-gray-400 text-sm cursor-not-allowed" />
                  <p className="text-xs text-gray-400 mt-1">ユーザーネームは変更できません</p>
                </div>
                <button onClick={handleSaveProfile} disabled={savingProfile}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {savingProfile ? '保存中...' : '変更を保存'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
