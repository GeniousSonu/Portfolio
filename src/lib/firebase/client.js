'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyB4HYPNdTz5wuFUaqhmQPMqBjQMV8NPbVs',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'portfolio-genious10.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'portfolio-genious10',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'portfolio-genious10.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '276556526457',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:276556526457:web:faaf30bb7eced8d1a535a8',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-GY70T10CC0',
};

// Initialize Firebase App (Singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// App Check Initialization
let appCheckInstance = null;
export async function initAppCheck() {
  if (typeof window === 'undefined') return null;
  if (appCheckInstance) return appCheckInstance;

  const recaptchaKey = process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY;
  const debugToken = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN;

  // Development debug token setup (never leaked in production)
  if (process.env.NODE_ENV === 'development' && debugToken) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
  }

  if (!recaptchaKey) {
    // Graceful fallback if reCAPTCHA key not yet provisioned in environment
    return null;
  }

  try {
    const { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaKey),
      isTokenAutoRefreshEnabled: true,
    });
    return appCheckInstance;
  } catch (err) {
    console.warn('[The Lounge] App Check initialization notice:', err?.message || err);
    return null;
  }
}

// Anonymous Auth Helper
let authPromise = null;
export function ensureAnonymousAuth() {
  if (typeof window === 'undefined') return Promise.resolve(null);

  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }

  if (authPromise) return authPromise;

  authPromise = new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        unsubscribe();
        authPromise = null;
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          unsubscribe();
          authPromise = null;
          resolve(cred.user);
        } catch (err) {
          unsubscribe();
          authPromise = null;
          console.error('[The Lounge] Anonymous auth error:', err);
          reject(err);
        }
      }
    });
  });

  return authPromise;
}

export default app;
