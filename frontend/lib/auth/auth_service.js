import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import api from '../api'
import { auth } from '../../services/firebase'

export const signupUser = async (email, password, name) => {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    if (name) {
      await updateProfile(credential.user, { displayName: name })
    }
    const idToken = await credential.user.getIdToken()

    const response = await api.post(
      '/api/auth/signup',
      { idToken, name },
      { withCredentials: true }
    )
    return response.data
  } catch (err) {
    const errorMessage =
      err.response?.data?.error || err.message || 'Error en el registro'
    throw new Error(errorMessage)
  }
}

export const loginEmail = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const idToken = await credential.user.getIdToken()

    const response = await api.post(
      '/api/auth/login',
      { idToken },
      { withCredentials: true }
    )
    return response.data
  } catch (err) {
    const errorMessage =
      err.response?.data?.error || err.message || 'Credenciales inválidas'
    throw new Error(errorMessage)
  }
}

export const loginGoogle = async () => {
  const provider = new GoogleAuthProvider()

  const result = await signInWithPopup(auth, provider)
  const idToken = await result.user.getIdToken()

  const response = await api.post(
    '/api/auth/login',
    { idToken },
    { withCredentials: true }
  )

  return response.data
}
