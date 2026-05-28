import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const app =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      project_id: process.env.NEXT_PUBLIC_PROJECTID,
      client_email: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      private_key: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n'
      ),
    }),
  })

export const adminAuth = getAuth(app)
