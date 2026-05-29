'use client'

import { useState, useEffect } from 'react'
import { updateProfile, deleteAccount } from './profile_service'
import { useUser } from './UserContext'
import { auth } from '../../services/firebase'
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth'

export function useProfile() {
  const { user, setUser } = useUser()

  const [infoForm, setInfoForm] = useState({ name: '', email: '' })
  const [infoStatus, setInfoStatus] = useState({ loading: false, error: null, success: false })

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwStatus, setPwStatus] = useState({ loading: false, error: null, success: false })

  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteStatus, setDeleteStatus] = useState({ loading: false, error: null })

  // Sync form with user data once loaded
  useEffect(() => {
    if (user) {
      setInfoForm({ name: user.name ?? '', email: user.email ?? '' })
    }
  }, [user])

  const handleInfoSave = async () => {
    setInfoStatus({ loading: true, error: null, success: false })
    try {
      const updated = await updateProfile({ name: infoForm.name, email: infoForm.email })
      setUser(updated)
      setInfoStatus({ loading: false, error: null, success: true })
      setTimeout(() => setInfoStatus((s) => ({ ...s, success: false })), 3000)
    } catch (err) {
      const msg = err.response?.data?.error ?? 'Error al guardar los cambios'
      setInfoStatus({ loading: false, error: msg, success: false })
    }
  }

  const handlePasswordChange = async () => {
    if (!pwForm.newPassword) {
      setPwStatus({ loading: false, error: 'Introduce la nueva contraseña', success: false })
      return
    }
    if (pwForm.newPassword.length < 6) {
      setPwStatus({ loading: false, error: 'La contraseña debe tener al menos 6 caracteres', success: false })
      return
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwStatus({ loading: false, error: 'Las contraseñas nuevas no coinciden', success: false })
      return
    }

    setPwStatus({ loading: true, error: null, success: false })
    try {
      const userCred = await signInWithEmailAndPassword(auth, user.email, pwForm.currentPassword)
      await updatePassword(userCred.user, pwForm.newPassword)
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPwStatus({ loading: false, error: null, success: true })
      setTimeout(() => setPwStatus((s) => ({ ...s, success: false })), 3000)
    } catch (err) {
      const errorMap = {
        'auth/wrong-password': 'Contraseña actual incorrecta',
        'auth/invalid-credential': 'Contraseña actual incorrecta',
        'auth/too-many-requests': 'Demasiados intentos. Espera un momento e inténtalo de nuevo',
        'auth/weak-password': 'La nueva contraseña es demasiado débil',
      }
      const msg = errorMap[err.code] ?? 'Error al cambiar la contraseña'
      setPwStatus({ loading: false, error: msg, success: false })
    }
  }

  const handleDeleteAccount = async (router) => {
    if (deleteConfirm !== 'ELIMINAR') return
    setDeleteStatus({ loading: true, error: null })
    try {
      await deleteAccount()
      router.push('/')
    } catch (err) {
      const msg = err.response?.data?.error ?? 'Error al eliminar la cuenta'
      setDeleteStatus({ loading: false, error: msg })
    }
  }

  return {
    user,
    infoForm,
    setInfoForm,
    infoStatus,
    pwForm,
    setPwForm,
    pwStatus,
    deleteConfirm,
    setDeleteConfirm,
    deleteStatus,
    handleInfoSave,
    handlePasswordChange,
    handleDeleteAccount,
  }
}
