'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockApps, mockUsers } from '@/lib/mockData';

const currentUser = mockUsers[0];
const myApps = mockApps.filter(a => a.author.id === currentUser.id);

const monthlyData = [
  { month: '9月', earnings: 18000, downloads: 240 },
  { month: '10月', earnings: 25000, downloads: 310 },
  { month: '11月', earnings: 32000, downloads: 420 },
  { month: '12月', earnings: 45000, downloads: 580 },
  { month: '1月', earnings: 38000, downloads: 490 },
  { month: '2月', earnings: 52000, downloads: 650 },
];

const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'earnings' | 'settings'>('overview');

  const totalEarnings = monthlyData.reduce((s, d) => s + d.earnings, 0);
  const totalDownloads = monthlyData.reduce((s, d) => s + d.downloads, 0);
  const thisMonthEarnings = monthlyData[monthlyData.length - 1].earnings;
  const lastMonthEarnings = monthlyData[monthlyData.length - 2].earnings;
  const earningsGrowth = Math.round(((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">クリエイターダッシュボード</h1>
            <p className="text-gray-500 mt-1">こんにちは、{currentUser.displayName}さん</p>
          </div>
          <Link
            href="/post"
            className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors"
          >
            + 新しいアプリを投稿
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-8">
          {([
            { id: 'overview', label: '概要' },
            { id: 'apps', label: `マイアプリ (${myApps.length})` },
            { id: 'earnings', label: '収益詳細' },
            { id: 'settings', label: '設定' },
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: '今月の収益',
                  value: `¥${thisMonthEarnings.toLocaleString()}`,
                  sub: `前月比 ${earningsGrowth > 0 ? '+' : ''}${earningsGrowth}%`,
                  trend: earningsGrowth > 0,
                  icon: '💴',
                  bg: 'bg-green-50',
                  text: 'text-green-600',
                },
                {
                  label: '累計収益',
                  value: `¥${currentUser.totalEarnings.toLocaleString()}`,
                  sub: '全期間',
                  trend: null,
                  icon: '📈',
                  bg: 'bg-indigo-50',
                  text: 'text-indigo-600',
                },
                {
                  label: '今月のDL数',
                  value: monthlyData[monthlyData.length - 1].downloads.toLocaleString(),
                  sub: '今月',
                  trend: null,
                  icon: '⬇️',
                  bg: 'bg-blue-50',
                  text: 'text-blue-600',
                },
                {
                  label: 'フォロワー',
                  value: currentUser.followers.toLocaleString(),
                  sub: '+42 今月',
                  trend: true,
                  icon: '👥',
                  bg: 'bg-purple-50',
                  text: 'text-purple-600',
                },
              ].map((stat) => (
                <div key={stat.label} className={`${stat.bg} rounded-2xl p-5`}>
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className={`text-2xl font-bold ${stat.text}`}>{stat.value}</div>
                  <div className="text-sm font-medium text-gray-700 mt-1">{stat.label}</div>
                  <div className={`text-xs mt-0.5 ${stat.trend === true ? 'text-green-600' : stat.trend === false ? 'text-red-500' : 'text-gray-400'}`}>
                    {stat.trend === true && '↑ '}
                    {stat.trend === false && '↓ '}
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Earnings Chart */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-5">収益推移 (過去6ヶ月)</h3>
              <div className="flex items-end gap-3 h-48">
                {monthlyData.map((data) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs font-medium text-indigo-600">¥{Math.floor(data.earnings / 1000)}k</div>
                    <div
                      className="w-full bg-indigo-500 rounded-t-lg hover:bg-indigo-600 transition-colors cursor-pointer"
                      style={{ height: `${(data.earnings / maxEarnings) * 160}px` }}
                      title={`${data.month}: ¥${data.earnings.toLocaleString()}`}
                    ></div>
                    <div className="text-xs text-gray-400">{data.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Apps Summary */}
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
                      <th className="pb-3 font-semibold text-gray-500 text-right">収益</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {myApps.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3">
                          <Link href={`/app/${app.id}`} className="font-medium text-gray-900 hover:text-indigo-600 line-clamp-1">
                            {app.title}
                          </Link>
                        </td>
                        <td className="py-3 text-right">
                          {app.pricing === 'free' ? (
                            <span className="text-green-600">無料</span>
                          ) : app.pricing === 'subscription' ? (
                            <span className="text-purple-600">サブスク</span>
                          ) : (
                            <span className="text-orange-600">¥{app.price.toLocaleString()}</span>
                          )}
                        </td>
                        <td className="py-3 text-right text-gray-600">{app.downloads.toLocaleString()}</td>
                        <td className="py-3 text-right text-gray-600">{app.likes.toLocaleString()}</td>
                        <td className="py-3 text-right font-medium text-indigo-600">
                          {app.pricing === 'free' ? '—' : `¥${Math.floor(app.downloads * app.price * 0.8).toLocaleString()}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Apps Tab */}
        {activeTab === 'apps' && (
          <div className="space-y-4">
            {myApps.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex gap-4">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img src={app.thumbnail} alt={app.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/app/${app.id}`} className="font-semibold text-gray-900 hover:text-indigo-600 line-clamp-1">{app.title}</Link>
                      <div className="flex gap-2 shrink-0">
                        <Link href={`/post?edit=${app.id}`} className="px-3 py-1 text-xs text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50">編集</Link>
                        <button className="px-3 py-1 text-xs text-red-500 border border-red-100 rounded-full hover:bg-red-50">削除</button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{app.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>♥ {app.likes.toLocaleString()}</span>
                      <span>↓ {app.downloads.toLocaleString()} DL</span>
                      <span>👁 {app.views.toLocaleString()} views</span>
                      {app.pricing !== 'free' && (
                        <span className="text-indigo-600 font-medium">
                          収益: ¥{Math.floor(app.downloads * (app.pricing === 'paid' ? app.price : 100) * 0.8).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Link
              href="/post"
              className="flex items-center justify-center gap-2 p-5 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              <span className="text-xl">+</span>
              <span className="font-medium">新しいアプリを投稿する</span>
            </Link>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: '未払い残高', value: `¥${(thisMonthEarnings * 0.7).toLocaleString()}`, action: '振込申請', primary: true },
                { label: '累計収益', value: `¥${totalEarnings.toLocaleString()}`, action: null, primary: false },
                { label: '累計ダウンロード', value: `${totalDownloads.toLocaleString()} 件`, action: null, primary: false },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{item.value}</div>
                  <div className="text-sm text-gray-500 mb-3">{item.label}</div>
                  {item.action && (
                    <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition-colors">
                      {item.action}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">月次収益レポート</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="pb-3 font-semibold text-gray-500">月</th>
                      <th className="pb-3 font-semibold text-gray-500 text-right">売上</th>
                      <th className="pb-3 font-semibold text-gray-500 text-right">手数料 (20%)</th>
                      <th className="pb-3 font-semibold text-gray-500 text-right">あなたの収益 (80%)</th>
                      <th className="pb-3 font-semibold text-gray-500 text-right">DL数</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[...monthlyData].reverse().map((data) => (
                      <tr key={data.month} className="hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900">2025年{data.month}</td>
                        <td className="py-3 text-right text-gray-600">¥{Math.floor(data.earnings / 0.8).toLocaleString()}</td>
                        <td className="py-3 text-right text-red-400">-¥{Math.floor(data.earnings * 0.2).toLocaleString()}</td>
                        <td className="py-3 text-right font-semibold text-indigo-600">¥{data.earnings.toLocaleString()}</td>
                        <td className="py-3 text-right text-gray-600">{data.downloads}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-5">プロフィール設定</h3>
              <div className="space-y-4">
                {[
                  { label: '表示名', value: currentUser.displayName, type: 'text' },
                  { label: 'ユーザーネーム', value: currentUser.username, type: 'text' },
                  { label: '自己紹介', value: currentUser.bio, type: 'textarea' },
                  { label: 'GitHub', value: currentUser.github || '', type: 'text' },
                  { label: 'Twitter / X', value: currentUser.twitter || '', type: 'text' },
                  { label: 'ウェブサイト', value: currentUser.website || '', type: 'text' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        defaultValue={field.value}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 resize-none text-sm"
                      />
                    ) : (
                      <input
                        type={field.type}
                        defaultValue={field.value}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 text-sm"
                      />
                    )}
                  </div>
                ))}
                <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors">
                  変更を保存
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-5">振込先設定</h3>
              <div className="space-y-4">
                {[
                  { label: '銀行名', placeholder: '例: 三菱UFJ銀行' },
                  { label: '支店名', placeholder: '例: 渋谷支店' },
                  { label: '口座種別', placeholder: '普通 / 当座' },
                  { label: '口座番号', placeholder: '0000000' },
                  { label: '口座名義', placeholder: 'タナカ タロウ' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 text-sm"
                    />
                  </div>
                ))}
                <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors">
                  保存する
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
