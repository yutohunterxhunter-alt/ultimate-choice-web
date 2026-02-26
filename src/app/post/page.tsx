'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PricingType } from '@/lib/types';
import { categories } from '@/lib/mockData';
import { createApp } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

const techOptions = ['React', 'Next.js', 'Vue.js', 'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Firebase', 'Supabase', 'Tailwind CSS', 'Node.js', 'FastAPI', 'Gemini API', 'OpenAI API', 'D3.js', 'Phaser.js', 'Three.js', 'PWA', 'WebSocket'];

export default function PostPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedId, setSubmittedId] = useState('');
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const screenshotsInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: '',
    techStack: [] as string[],
    tags: '',
    pricing: 'free' as PricingType,
    price: '',
    demoUrl: '',
    sourceUrl: '',
    thumbnail: null as File | null,
    thumbnailPreview: '',
    screenshots: [] as File[],
    screenshotPreviews: [] as string[],
  });

  const update = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleTech = (tech: string) => {
    const current = form.techStack;
    if (current.includes(tech)) {
      update('techStack', current.filter((t) => t !== tech));
    } else {
      update('techStack', [...current, tech]);
    }
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm(prev => ({ ...prev, thumbnail: file, thumbnailPreview: preview }));
  };

  const handleScreenshots = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    const previews = files.map(f => URL.createObjectURL(f));
    setForm(prev => ({ ...prev, screenshots: files, screenshotPreviews: previews }));
  };

  const canProceedStep1 = form.title.trim() && form.description.trim() && form.category;
  const canProceedStep2 = form.longDescription.trim() && form.techStack.length > 0;
  const canSubmit = canProceedStep1 && canProceedStep2 && (form.pricing !== 'paid' || (form.price && Number(form.price) > 0));

  const handleSubmit = async () => {
    if (!user || !profile) {
      router.push('/login');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const appId = await createApp({
        title: form.title,
        description: form.description,
        longDescription: form.longDescription,
        category: form.category,
        techStack: form.techStack,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        pricing: form.pricing,
        price: form.pricing === 'paid' ? Number(form.price) : 0,
        demoUrl: form.demoUrl,
        sourceUrl: form.sourceUrl,
        thumbnail: form.thumbnail,
        screenshots: form.screenshots,
        authorId: user.uid,
        authorUsername: profile.username,
        authorDisplayName: profile.displayName,
        authorPhotoURL: profile.photoURL || '',
      });
      setSubmittedId(appId);
    } catch (err) {
      console.error(err);
      setError('投稿に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h1>
          <p className="text-gray-500 mb-8">アプリを投稿するにはアカウントが必要です</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors">
              ログイン
            </Link>
            <Link href="/signup" className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors">
              新規登録
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (submittedId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">投稿完了！</h1>
          <p className="text-gray-500 mb-8">アプリが公開されました！</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/app/${submittedId}`} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors">
              投稿を見る
            </Link>
            <Link href="/dashboard" className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors">
              ダッシュボードへ
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">アプリを投稿する</h1>
          <p className="text-gray-500">作ったアプリをコミュニティに共有しよう</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          {[
            { n: 1, label: '基本情報' },
            { n: 2, label: '詳細・技術' },
            { n: 3, label: '価格設定' },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step > n ? 'bg-green-500 text-white' : step === n ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > n ? '✓' : n}
                </div>
                <span className="text-xs mt-1 text-gray-500 hidden sm:block">{label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${step > n ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">基本情報</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">アプリ名 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="例: DevTimer Pro - ポモドーロタイマー"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 transition-colors"
                maxLength={80}
              />
              <div className="text-right text-xs text-gray-400 mt-1">{form.title.length}/80</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">一言説明 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="例: エンジニア向けに最適化されたポモドーロタイマー"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 transition-colors"
                maxLength={120}
              />
              <div className="text-right text-xs text-gray-400 mt-1">{form.description.length}/120</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">カテゴリ <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {categories.filter(c => c.id !== 'all').map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => update('category', cat.id)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors ${
                      form.category === cat.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">サムネイル画像</label>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnail}
                className="hidden"
              />
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden text-center hover:border-indigo-300 transition-colors cursor-pointer"
              >
                {form.thumbnailPreview ? (
                  <img src={form.thumbnailPreview} alt="thumbnail" className="w-full h-40 object-cover" />
                ) : (
                  <div className="p-8">
                    <div className="text-3xl mb-2">🖼️</div>
                    <p className="text-sm text-gray-500">クリックして画像をアップロード</p>
                    <p className="text-xs text-gray-400 mt-1">PNG / JPG (推奨: 16:9, 最大 5MB)</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">スクリーンショット（最大5枚）</label>
              <input
                ref={screenshotsInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleScreenshots}
                className="hidden"
              />
              {form.screenshotPreviews.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {form.screenshotPreviews.map((src, i) => (
                    <img key={i} src={src} alt="" className="w-20 h-14 object-cover rounded-lg border border-gray-200" />
                  ))}
                  <button
                    type="button"
                    onClick={() => screenshotsInputRef.current?.click()}
                    className="w-20 h-14 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-indigo-300 transition-colors text-xs"
                  >
                    変更
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => screenshotsInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-300 transition-colors cursor-pointer"
                >
                  <p className="text-sm text-gray-500">クリックして追加</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              次へ →
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">詳細情報・技術スタック</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                詳細説明 <span className="text-red-500">*</span>
                <span className="ml-1 text-xs text-gray-400 font-normal">(Markdown対応)</span>
              </label>
              <textarea
                value={form.longDescription}
                onChange={(e) => update('longDescription', e.target.value)}
                placeholder={'## アプリについて\n\n機能の説明、使い方、技術的な詳細など...'}
                rows={10}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 transition-colors font-mono text-sm resize-none"
              />
              <div className="text-right text-xs text-gray-400 mt-1">{form.longDescription.length}文字</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">使用技術 <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {techOptions.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      form.techStack.includes(tech)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">タグ</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => update('tags', e.target.value)}
                placeholder="例: ポモドーロ, タイマー, 生産性 (カンマ区切り)"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">デモURL</label>
                <input
                  type="url"
                  value={form.demoUrl}
                  onChange={(e) => update('demoUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">ソースコードURL</label>
                <input
                  type="url"
                  value={form.sourceUrl}
                  onChange={(e) => update('sourceUrl', e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors">
                ← 戻る
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                次へ →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Pricing */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">価格設定</h2>
            <div className="space-y-3">
              {[
                { id: 'free', icon: '🎁', label: '無料', desc: '誰でも無料でダウンロード・使用できます' },
                { id: 'paid', icon: '💰', label: '有料 (買い切り)', desc: 'あなたが設定した価格で購入できます' },
                { id: 'subscription', icon: '⚡', label: 'サブスクリプション対応', desc: 'サブスク会員が月額料金で使い放題になります' },
              ].map(({ id, icon, label, desc }) => (
                <label
                  key={id}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    form.pricing === id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="pricing"
                    value={id}
                    checked={form.pricing === id}
                    onChange={() => update('pricing', id)}
                    className="mt-1 accent-indigo-600"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{icon} {label}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{desc}</div>
                  </div>
                </label>
              ))}
            </div>

            {form.pricing === 'paid' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">価格 (円) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400 font-medium">¥</span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => update('price', e.target.value)}
                    placeholder="500"
                    min="100"
                    max="50000"
                    step="100"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 transition-colors"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-400 space-y-1">
                  <p>* 最低価格: ¥100</p>
                  <p>* 販売手数料: 20% (あなたの取り分: {form.price ? `¥${Math.floor(Number(form.price) * 0.8).toLocaleString()}` : '—'})</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm font-semibold text-gray-700 mb-2">投稿前の確認</div>
              <ul className="space-y-1.5 text-sm text-gray-500">
                <li className={`flex items-center gap-2 ${form.title ? 'text-green-600' : ''}`}>
                  <span>{form.title ? '✓' : '○'}</span> アプリ名: {form.title || '未入力'}
                </li>
                <li className={`flex items-center gap-2 ${form.category ? 'text-green-600' : ''}`}>
                  <span>{form.category ? '✓' : '○'}</span> カテゴリ: {form.category || '未選択'}
                </li>
                <li className={`flex items-center gap-2 ${form.techStack.length > 0 ? 'text-green-600' : ''}`}>
                  <span>{form.techStack.length > 0 ? '✓' : '○'}</span> 技術スタック: {form.techStack.length > 0 ? form.techStack.join(', ') : '未選択'}
                </li>
                <li className="flex items-center gap-2 text-green-600">
                  <span>✓</span> 価格設定: {form.pricing === 'free' ? '無料' : form.pricing === 'subscription' ? 'サブスク' : `¥${Number(form.price).toLocaleString()}`}
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors">
                ← 戻る
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'アップロード中...' : '投稿する 🚀'}
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
