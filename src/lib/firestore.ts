import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import type { PricingType } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppDoc {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnailUrl: string;
  screenshotUrls: string[];
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  authorPhotoURL: string;
  techStack: string[];
  category: string;
  tags: string[];
  pricing: PricingType;
  price: number;
  likes: number;
  commentsCount: number;
  downloads: number;
  views: number;
  demoUrl: string;
  sourceUrl: string;
  featured: boolean;
  trending: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface CommentDoc {
  id: string;
  appId: string;
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  authorPhotoURL: string;
  content: string;
  createdAt: Timestamp | null;
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ─── Apps ─────────────────────────────────────────────────────────────────────

export interface CreateAppData {
  title: string;
  description: string;
  longDescription: string;
  category: string;
  techStack: string[];
  tags: string[];
  pricing: PricingType;
  price: number;
  demoUrl: string;
  sourceUrl: string;
  thumbnail: File | null;
  screenshots: File[];
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  authorPhotoURL: string;
}

export async function createApp(data: CreateAppData): Promise<string> {
  let thumbnailUrl = '';
  const screenshotUrls: string[] = [];

  const tempId = `${data.authorId}_${Date.now()}`;

  if (data.thumbnail) {
    thumbnailUrl = await uploadImage(data.thumbnail, `apps/${tempId}/thumbnail`);
  }
  for (let i = 0; i < data.screenshots.length; i++) {
    const url = await uploadImage(data.screenshots[i], `apps/${tempId}/screenshot_${i}`);
    screenshotUrls.push(url);
  }

  const docRef = await addDoc(collection(db, 'apps'), {
    title: data.title,
    description: data.description,
    longDescription: data.longDescription,
    thumbnailUrl,
    screenshotUrls,
    authorId: data.authorId,
    authorUsername: data.authorUsername,
    authorDisplayName: data.authorDisplayName,
    authorPhotoURL: data.authorPhotoURL,
    techStack: data.techStack,
    category: data.category,
    tags: data.tags,
    pricing: data.pricing,
    price: data.price,
    demoUrl: data.demoUrl,
    sourceUrl: data.sourceUrl,
    likes: 0,
    commentsCount: 0,
    downloads: 0,
    views: 0,
    featured: false,
    trending: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getApp(id: string): Promise<AppDoc | null> {
  const snap = await getDoc(doc(db, 'apps', id));
  if (!snap.exists()) return null;
  // increment views
  await updateDoc(doc(db, 'apps', id), { views: increment(1) });
  return { id: snap.id, ...snap.data() } as AppDoc;
}

export async function getApps(opts: {
  category?: string;
  orderField?: 'createdAt' | 'likes' | 'views' | 'downloads';
  limitCount?: number;
} = {}): Promise<AppDoc[]> {
  const { category, orderField = 'createdAt', limitCount = 20 } = opts;
  let q = query(
    collection(db, 'apps'),
    orderBy(orderField, 'desc'),
    limit(limitCount)
  );
  if (category && category !== 'all') {
    q = query(
      collection(db, 'apps'),
      where('category', '==', category),
      orderBy(orderField, 'desc'),
      limit(limitCount)
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AppDoc));
}

export async function getAppsByAuthor(authorId: string): Promise<AppDoc[]> {
  const q = query(
    collection(db, 'apps'),
    where('authorId', '==', authorId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AppDoc));
}

export async function deleteApp(appId: string): Promise<void> {
  await deleteDoc(doc(db, 'apps', appId));
}

// ─── Likes ────────────────────────────────────────────────────────────────────

export async function isLiked(appId: string, userId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'likes', `${userId}_${appId}`));
  return snap.exists();
}

export async function toggleLike(appId: string, userId: string): Promise<boolean> {
  const likeRef = doc(db, 'likes', `${userId}_${appId}`);
  const appRef = doc(db, 'apps', appId);
  const snap = await getDoc(likeRef);
  if (snap.exists()) {
    await deleteDoc(likeRef);
    await updateDoc(appRef, { likes: increment(-1) });
    return false;
  } else {
    await setDoc(likeRef, { appId, userId, createdAt: serverTimestamp() });
    await updateDoc(appRef, { likes: increment(1) });
    return true;
  }
}

export async function getLikedAppIds(userId: string): Promise<string[]> {
  const q = query(collection(db, 'likes'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data().appId as string);
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export async function getComments(appId: string): Promise<CommentDoc[]> {
  const q = query(
    collection(db, 'comments'),
    where('appId', '==', appId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as CommentDoc));
}

export async function addComment(
  appId: string,
  content: string,
  author: { uid: string; username: string; displayName: string; photoURL: string }
): Promise<CommentDoc> {
  const docRef = await addDoc(collection(db, 'comments'), {
    appId,
    authorId: author.uid,
    authorUsername: author.username,
    authorDisplayName: author.displayName,
    authorPhotoURL: author.photoURL,
    content,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'apps', appId), { commentsCount: increment(1) });
  return {
    id: docRef.id,
    appId,
    authorId: author.uid,
    authorUsername: author.username,
    authorDisplayName: author.displayName,
    authorPhotoURL: author.photoURL,
    content,
    createdAt: null,
  };
}

// ─── Follows ──────────────────────────────────────────────────────────────────

export async function isFollowing(followerId: string, targetId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'follows', `${followerId}_${targetId}`));
  return snap.exists();
}

export async function toggleFollow(followerId: string, targetId: string): Promise<boolean> {
  const followRef = doc(db, 'follows', `${followerId}_${targetId}`);
  const targetRef = doc(db, 'users', targetId);
  const followerRef = doc(db, 'users', followerId);
  const snap = await getDoc(followRef);
  if (snap.exists()) {
    await deleteDoc(followRef);
    await updateDoc(targetRef, { followers: increment(-1) });
    await updateDoc(followerRef, { following: increment(-1) });
    return false;
  } else {
    await setDoc(followRef, { followerId, targetId, createdAt: serverTimestamp() });
    await updateDoc(targetRef, { followers: increment(1) });
    await updateDoc(followerRef, { following: increment(1) });
    return true;
  }
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUserByUsername(username: string) {
  const q = query(collection(db, 'users'), where('username', '==', username), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { uid: d.id, ...d.data() };
}

export async function updateUserProfile(uid: string, data: Partial<{
  displayName: string;
  bio: string;
  github: string;
  twitter: string;
  website: string;
}>) {
  await updateDoc(doc(db, 'users', uid), data);
}

export async function getTopCreators(limitCount = 5) {
  const q = query(
    collection(db, 'users'),
    orderBy('followers', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}
