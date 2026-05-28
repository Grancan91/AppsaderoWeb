'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginEmail, loginGoogle, signupUser } from '../lib/auth/auth_service'

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(null)
  const loading = pending !== null
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

  const runAction = async (key, fn, fallbackMsg) => {
    setError(null)
    setPending(key)
    try {
      await fn()
      router.push('/dashboard')
    } catch (err) {
      console.error(`Error en ${key}:`, err)
      setError(err.message || fallbackMsg)
    } finally {
      setPending(null)
    }
  }

  const handleRegister = () =>
    runAction(
      'register',
      () => signupUser(form.email, form.password, form.name),
      'No se pudo crear la cuenta'
    )

  const handleLogin = () =>
    runAction(
      'login',
      () => loginEmail(form.email, form.password),
      'No se pudo iniciar sesión'
    )

  const handleGoogleLogin = () =>
    runAction('google', () => loginGoogle(), 'No se pudo iniciar sesión')

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
                {pending === 'register' ? 'Creando cuenta…' : 'Crear cuenta'}
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
                onClick={handleLogin}
                disabled={loading}
              >
                {pending === 'login' ? 'Ingresando…' : 'Iniciar sesión'}
              </button>

              <button
                className="btn-secondary"
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {pending === 'google' ? 'Ingresando…' : 'Ingresar con Google'}
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
