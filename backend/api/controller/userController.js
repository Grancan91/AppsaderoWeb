import User from '../model/user.js'
import { adminAuth } from '../../firebaseAdmin.js'

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ where: { firebaseUid: req.user.uid } })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json({ id: user.id, email: user.email, name: user.name, provider: user.provider })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener perfil', details: err.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body
    if (name === undefined && email === undefined) {
      return res.status(400).json({ error: 'Debes proporcionar al menos un campo para actualizar' })
    }

    const user = await User.findOne({ where: { firebaseUid: req.user.uid } })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    const updates = {}

    if (name !== undefined) {
      const trimmed = name.trim()
      if (!trimmed) return res.status(400).json({ error: 'El nombre no puede estar vacío' })
      updates.name = trimmed
    }

    if (email !== undefined) {
      const trimmed = email.toLowerCase().trim()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(trimmed)) return res.status(400).json({ error: 'Correo electrónico inválido' })
      await adminAuth.updateUser(req.user.uid, { email: trimmed })
      updates.email = trimmed
    }

    await user.update(updates)
    res.json({ id: user.id, email: user.email, name: user.name, provider: user.provider })
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      return res.status(409).json({ error: 'Ese correo ya está en uso' })
    }
    res.status(500).json({ error: 'Error al actualizar perfil', details: err.message })
  }
}

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findOne({ where: { firebaseUid: req.user.uid } })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    await adminAuth.deleteUser(req.user.uid)
    await user.destroy()

    res.clearCookie('session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    res.json({ message: 'Cuenta eliminada correctamente' })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar cuenta', details: err.message })
  }
}
