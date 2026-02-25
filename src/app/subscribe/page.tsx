'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import { subscriptionPlans, mockApps } from '@/lib/mockData';

export default function SubscribePage() {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlan, setSelectedPlan] = useState('plan_yearly');

  const subscriptionApps = mockApps.filter(a => a.pricing === 'subscription');
  const plans = subscriptionPlans.filter(p => p.interval === interval);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            ⚡ CodeShare サブスクリプション
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            全アプリを<span className="text-yellow-300">使い放題</span>
          </h1>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            サブスクリプション対応の全アプリが月額固定料金で無制限に使えます。
            新しいアプリが追加されるたびに、追加料金なしで利用可能。
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm bg-white/20 px-3 py-1.5 rounded-full">✓ 広告なし</div>
            <div className="flex items-center gap-1.5 text-sm bg-white/20 px-3 py-1.5 rounded-full">✓ いつでもキャンセル可能</div>
            <div className="flex items-center gap-1.5 text-sm bg-white/20 px-3 py-1.5 rounded-full">✓ 全サブスク対応アプリ使い放題</div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Toggle */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center bg-white border border-gray-200 rounded-full p-1">
            {(['monthly', 'yearly'] as const).map((int) => (
              <button
                key={int}
                onClick={() => setInterval(int)}
                className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${
                  interval === int
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {int === 'monthly' ? '月払い' : (
                  <span className="flex items-center gap-2">
                    年払い
                    <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">お得</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="flex justify-center mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl border-2 p-8 max-w-md w-full transition-all ${
                plan.recommended
                  ? 'border-indigo-500 shadow-xl shadow-indigo-100 scale-105'
                  : 'border-gray-200'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                    おすすめ
                  </span>
                </div>
              )}
              <div className="text-xl font-bold text-gray-900 mb-2">{plan.name}</div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-bold text-gray-900">¥{plan.price.toLocaleString()}</span>
                <span className="text-gray-400 mb-1">/ {plan.interval === 'monthly' ? '月' : '年'}</span>
              </div>
              {plan.interval === 'yearly' && (
                <div className="text-sm text-green-600 font-medium mb-5">
                  月換算 ¥{Math.floor(plan.price / 12).toLocaleString()} · 2ヶ月分お得！
                </div>
              )}
              {plan.interval === 'monthly' && <div className="mb-5"></div>}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3.5 font-bold rounded-full transition-colors ${
                  plan.recommended
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                プランを選択 →
              </button>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: '🚀',
              title: '無制限アクセス',
              desc: 'サブスク対応の全アプリが追加料金なしで使い放題。毎月新しいアプリが追加されます。',
            },
            {
              icon: '💰',
              title: 'クリエイターを応援',
              desc: '月額料金の70%はクリエイターに分配されます。あなたの利用がクリエイターの収益に。',
            },
            {
              icon: '🔒',
              title: 'いつでもキャンセル',
              desc: '契約期間の縛りなし。いつでもキャンセル可能で、リスクゼロで試せます。',
            },
          ].map((item) => (
            <div key={item.title} className="text-center p-6 bg-white rounded-2xl border border-gray-200">
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="font-bold text-gray-900 mb-2">{item.title}</div>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Subscription Apps */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">サブスク対応アプリ</h2>
            <Link href="/explore?filter=subscription" className="text-sm text-indigo-600 hover:underline">すべて見る →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subscriptionApps.map((app) => (
              <AppCard key={app.id} app={app} variant="featured" />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">よくある質問</h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {[
              {
                q: 'サブスクリプションでどのアプリが使えますか？',
                a: '「サブスク対応」バッジが付いたアプリが全て使い放題になります。無料アプリはもともと無料でご利用いただけます。',
              },
              {
                q: 'キャンセルはいつでもできますか？',
                a: 'はい、いつでもキャンセル可能です。キャンセル後は現在の請求期間の終わりまでサービスをご利用いただけます。',
              },
              {
                q: '年払いと月払いの違いは？',
                a: '年払いは月払いの10ヶ月分の価格（実質2ヶ月分お得）です。それ以外の機能・サービス内容は同じです。',
              },
              {
                q: '支払い方法は何が使えますか？',
                a: 'クレジットカード（Visa, Mastercard, JCB, American Express）がご利用いただけます。',
              },
            ].map((item) => (
              <details key={item.q} className="bg-white rounded-xl border border-gray-200 p-5 group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
