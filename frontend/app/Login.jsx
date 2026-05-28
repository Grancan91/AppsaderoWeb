'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginGoogle } from '../lib/auth/auth_service'

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setError(null)
    setLoading(true)
    try {
      await loginGoogle()
      router.push('/dashboard')
    } catch (err) {
      console.error('Error durante el login con Google:', err)
      setError(err.response?.data?.error || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="paper">
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <h1>Appsadero</h1>
          <label>
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
          </label>

          {error && <p className="login-error">{error}</p>}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? 'Ingresando…' : 'Ingresar con Google'}
          </button>
        </form>
      </div>
    </main>
  )
}
