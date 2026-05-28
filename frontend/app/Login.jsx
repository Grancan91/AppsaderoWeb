'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginGoogle, signupUser } from '../lib/auth/auth_service'

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', name: '' })

  const updateField = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleShowRegister = () => {
    setError(null)
    setIsRegister(true)
  }

  const handleBack = () => {
    setError(null)
    setIsRegister(false)
  }

  const handleRegister = async () => {
    setError(null)
    setLoading(true)
    try {
      await signupUser(form.email, form.password, form.name)
      router.push('/dashboard')
    } catch (err) {
      console.error('Error durante el registro:', err)
      setError(err.message || 'No se pudo crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

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

          {isRegister && (
            <label>
              Nombre
              <input
                type="text"
                name="name"
                placeholder="Tu nombre"
                value={form.name}
                onChange={updateField}
                required
              />
            </label>
          )}

          <label>
            Usuario
            <input
              type="text"
              name="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={updateField}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={updateField}
              required
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          {isRegister ? (
            <>
              <button
                className="btn-primary"
                type="button"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? 'Creando cuenta…' : 'Crear cuenta'}
              </button>
              <button
                className="link-button"
                type="button"
                onClick={handleBack}
                disabled={loading}
              >
                ← Volver
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-primary"
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? 'Ingresando…' : 'Iniciar sesión'}
              </button>

              <button
                className="btn-secondary"
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? 'Ingresando…' : 'Ingresar con Google'}
              </button>

              <button
                className="link-button"
                type="button"
                onClick={handleShowRegister}
                disabled={loading}
              >
                ¿No tienes cuenta? Regístrate
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  )
}
