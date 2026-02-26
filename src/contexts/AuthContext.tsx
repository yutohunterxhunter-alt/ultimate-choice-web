'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../../lib/firebase';

export interface UserProfile {
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
  createdAt: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, username: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      setProfile(snap.data() as UserProfile);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.uid);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    const docRef = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      const baseUsername = (firebaseUser.displayName || 'user')
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '');
      const username = `${baseUsername}${Math.floor(Math.random() * 9999)}`;
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        username,
        displayName: firebaseUser.displayName || 'ユーザー',
        bio: '',
        photoURL: firebaseUser.photoURL || '',
        github: '',
        twitter: '',
        website: '',
        followers: 0,
        following: 0,
        totalDownloads: 0,
        isVerified: false,
        isPro: false,
        createdAt: new Date().toISOString(),
      };
      await setDoc(docRef, { ...newProfile, createdAt: serverTimestamp() });
      setProfile(newProfile);
    } else {
      setProfile(snap.data() as UserProfile);
    }
  };

  const signup = async (email: string, password: string, username: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;
    await updateProfile(firebaseUser, { displayName });
    const newProfile: UserProfile = {
      uid: firebaseUser.uid,
      username,
      displayName,
      bio: '',
      photoURL: '',
      github: '',
      twitter: '',
      website: '',
      followers: 0,
      following: 0,
      totalDownloads: 0,
      isVerified: false,
      isPro: false,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...newProfile,
      createdAt: serverTimestamp(),
    });
    // Register username → uid mapping for lookup
    await setDoc(doc(db, 'usernames', username), { uid: firebaseUser.uid });
    setProfile(newProfile);
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithEmail, loginWithGoogle, signup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
