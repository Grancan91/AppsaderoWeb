import { cert, getApps, initializeApp } from 'firebase-admin/app'

import { getAuth } from 'firebase-admin/auth'

const app =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,

      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,

      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n'
      ),
    }),
  })

export const adminAuth = getAuth(app)
