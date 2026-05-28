'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import api from '../services/api'
import { auth } from '../services/firebase'

export default function Login() {
  const provider = new GoogleAuthProvider()
  const router = useRouter()

  async function loginGoogle() {
    try {
      // 1. Autenticar con Google en el Frontend
      const result = await signInWithPopup(auth, provider)

      // 2. Obtener el ID Token de Firebase
      const idToken = await result.user.getIdToken()

      // 3. Enviar el token a tu Backend Express
      const response = await api.post(
        'api/auth/login',
        { idToken },
        { withCredentials: true }
      )

      // 4. Si el backend responde con éxito (cookie seteada), redirigimos
      if (response.data && response.data.success) {
        console.log('Login correcto:', response.data.message)
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error durante el login con Google:', error)
    }
  }

  return (
    <main className="login-page">
      <div className="paper">
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <h1>Appsadero</h1>
         {/*  <label>
            Usuario
            <input
              type="text"
              name="username"
              placeholder="tu@email.com"
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </label> */}

          <button type="button" onClick={loginGoogle}>
            Ingresar con Google
          </button>
        </form>
      </div>
    </main>
  )
}
