'use client';

import Link from 'next/link';
import { useState } from 'react';
import { App } from '@/lib/types';
import { formatPrice, timeAgo } from '@/lib/mockData';

interface AppCardProps {
  app: App;
  variant?: 'default' | 'compact' | 'featured';
}

export default function AppCard({ app, variant = 'default' }: AppCardProps) {
  const [liked, setLiked] = useState(app.isLiked);
  const [likeCount, setLikeCount] = useState(app.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const pricingBadge = () => {
    if (app.pricing === 'free') {
      return <span className="px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">無料</span>;
    }
    if (app.pricing === 'subscription') {
      return <span className="px-2 py-0.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">サブスク</span>;
    }
    return <span className="px-2 py-0.5 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">¥{app.price.toLocaleString()}</span>;
  };

  if (variant === 'compact') {
    return (
      <Link href={`/app/${app.id}`} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
          <img src={app.thumbnail} alt={app.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 line-clamp-2 leading-tight">{app.title}</h3>
            {pricingBadge()}
          </div>
          <p className="text-xs text-gray-500 mt-1">{app.author.displayName}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likeCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              {app.downloads.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/app/${app.id}`} className="group relative block rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="aspect-video overflow-hidden">
          <img src={app.thumbnail} alt={app.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          {app.trending && (
            <span className="px-2 py-0.5 text-xs font-bold text-white bg-orange-500 rounded-full shadow-sm">🔥 急上昇</span>
          )}
          {app.featured && (
            <span className="px-2 py-0.5 text-xs font-bold text-white bg-indigo-600 rounded-full shadow-sm">⭐ 注目</span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">{app.title}</h3>
            {pricingBadge()}
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{app.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {app.techStack.slice(0, 3).map((tech) => (
              <span key={tech} className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded-md">{tech}</span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                {app.author.displayName[0]}
              </div>
              <span className="text-xs text-gray-600">{app.author.displayName}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <button onClick={handleLike} className={`flex items-center gap-1 transition-colors ${liked ? 'text-pink-500' : 'hover:text-pink-400'}`}>
                <svg className="w-3.5 h-3.5" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {likeCount.toLocaleString()}
              </button>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {app.comments}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/app/${app.id}`} className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className="aspect-video overflow-hidden bg-gray-100">
        <img src={app.thumbnail} alt={app.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 text-sm leading-snug">{app.title}</h3>
          {pricingBadge()}
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{app.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
              {app.author.displayName[0]}
            </div>
            <span className="text-xs text-gray-500">{app.author.displayName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <button onClick={handleLike} className={`flex items-center gap-0.5 transition-colors ${liked ? 'text-pink-500' : 'hover:text-pink-400'}`}>
              <svg className="w-3.5 h-3.5" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likeCount}
            </button>
            <span className="flex items-center gap-0.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              {app.downloads}
            </span>
            <span className="text-gray-300">{timeAgo(app.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
