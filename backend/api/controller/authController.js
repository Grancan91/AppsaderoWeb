// Inicializa Firebase Admin en el servidor.
// Se usa para verificar tokens y gestionar sesiones/cookies.

import { cert, getApps, initializeApp } from 'firebase-admin/app'

import { getAuth } from 'firebase-admin/auth'

// Reutiliza la instancia si Next ya la creó para evitar "Firebase app already exists".
const app =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      project_id: process.env.NEXT_PUBLIC_PROJECTID,
      client_email: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      private_key: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
    }),
  })

// Auth administrativo para backend.
export const adminAuth = getAuth(app)
