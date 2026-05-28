// Inicializa Firebase Admin en el servidor.
// Se usa para verificar tokens y gestionar sesiones/cookies.

import { cert, getApps, initializeApp } from 'firebase-admin/app'

import { getAuth } from 'firebase-admin/auth'

// Reutiliza la instancia si Next ya la creó
// para evitar "Firebase app already exists".
const app =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_PROJECTID,

      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,

      // Convierte saltos \n del .env
      // al formato PEM esperado.
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n'
      ),
    }),
  })

// Auth administrativo para backend.
export const adminAuth = getAuth(app)
