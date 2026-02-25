export type PricingType = 'free' | 'paid' | 'subscription';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  isVerified: boolean;
  isPro: boolean;
  joinedAt: string;
  website?: string;
  github?: string;
  twitter?: string;
  totalEarnings: number;
  totalDownloads: number;
}

export interface App {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  screenshots: string[];
  author: User;
  techStack: string[];
  category: string;
  tags: string[];
  pricing: PricingType;
  price: number;
  currency: string;
  likes: number;
  comments: number;
  downloads: number;
  views: number;
  isLiked: boolean;
  isPurchased: boolean;
  createdAt: string;
  updatedAt: string;
  demoUrl?: string;
  sourceUrl?: string;
  featured: boolean;
  trending: boolean;
}

export interface Comment {
  id: string;
  appId: string;
  author: User;
  content: string;
  likes: number;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  recommended: boolean;
}

export type Category =
  | 'all'
  | 'productivity'
  | 'developer-tools'
  | 'games'
  | 'design'
  | 'finance'
  | 'social'
  | 'education'
  | 'utilities';
