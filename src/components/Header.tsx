'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, profile, logout, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push('/');
  };

  const avatarLetter = profile?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || '?';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 shrink-0">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>CodeShare</span>
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="アプリを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-indigo-300 transition-colors"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          {/* Nav links - desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/explore" className="px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              探索
            </Link>
            <Link href="/subscribe" className="px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              サブスク
            </Link>

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      ダッシュボード
                    </Link>
                    <Link
                      href="/post"
                      className="ml-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors"
                    >
                      + 投稿する
                    </Link>
                    {/* Avatar dropdown */}
                    <div className="relative ml-2" ref={dropdownRef}>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold hover:bg-indigo-200 transition-colors overflow-hidden"
                      >
                        {profile?.photoURL ? (
                          <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                        ) : avatarLetter}
                      </button>
                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-gray-200 shadow-lg py-1 z-50">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <div className="text-sm font-semibold text-gray-900 truncate">{profile?.displayName}</div>
                            <div className="text-xs text-gray-400 truncate">@{profile?.username}</div>
                          </div>
                          <Link
                            href={`/profile/${profile?.username}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setDropdownOpen(false)}
                          >
                            プロフィール
                          </Link>
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setDropdownOpen(false)}
                          >
                            ダッシュボード
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 border-t border-gray-100 mt-1"
                          >
                            ログアウト
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      ログイン
                    </Link>
                    <Link href="/signup" className="ml-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors">
                      新規登録
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            <form onSubmit={handleSearch} className="mb-3">
              <input
                type="text"
                placeholder="アプリを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-gray-100 border border-transparent rounded-full focus:outline-none"
              />
            </form>
            <nav className="flex flex-col gap-1">
              <Link href="/explore" className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>探索</Link>
              <Link href="/subscribe" className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>サブスクリプション</Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>ダッシュボード</Link>
                  <Link href={`/profile/${profile?.username}`} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>プロフィール</Link>
                  <Link href="/post" className="mt-2 px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 rounded-full" onClick={() => setMenuOpen(false)}>+ 投稿する</Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mt-1 px-4 py-2 text-sm text-red-500 text-center">ログアウト</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>ログイン</Link>
                  <Link href="/signup" className="mt-2 px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 rounded-full" onClick={() => setMenuOpen(false)}>新規登録</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
