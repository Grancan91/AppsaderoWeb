import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import api from '../api'
import { auth } from '../../services/firebase'

export const registerUser = async (email, password, name) => {
  try {
    const response = await api.post('/api/auth/register', {
      email,
      password,
      name,
    })
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.error || 'Error en el registro'
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
