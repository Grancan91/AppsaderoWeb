"use client"

import React from 'react'

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import api from '../services/api'
import { auth } from '../services/firebase'

export default function Login() {
  const provider = new GoogleAuthProvider()

  async function loginGoogle() {
    try {
      const result = await signInWithPopup(auth, provider)

      const idToken = await result.user.getIdToken()

      // Send the ID token to the backend for verification
      await api.post('/api/auth/login', { idToken }, { withCredentials: true })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="login-page paper">
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <h1>Login</h1>
        <label>
          Usuario
          <input type="text" name="username" placeholder="" />
        </label>
        <label>
          Contraseña
          <input type="password" name="password" placeholder="" />
        </label>

        <button type="button" onClick={loginGoogle}>
          Ingresar con Google
        </button>
      </form>
    </main>
  )
}
