import User from '../model/user.js'
import { adminAuth } from '../../firebaseAdmin.js'

const SESSION_EXPIRES_IN = 1000 * 60 * 60 * 24 * 5

const issueSessionCookie = async (res, idToken) => {
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRES_IN,
  })
  res.cookie('session', sessionCookie, {
    maxAge: SESSION_EXPIRES_IN,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
}

export const loginGoogle = async (req, res) => {
  try {
    const { idToken } = req.body
    if (!idToken) {
      return res.status(400).json({ error: 'Missing idToken' })
    }

    const decoded = await adminAuth.verifyIdToken(idToken)
    const { email, name, uid } = decoded

    let user = await User.findOne({ where: { email } })
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || email,
      })
    }

    await issueSessionCookie(res, idToken)
    return res.json({ id: user.id, email: user.email, name: user.name })
  } catch (err) {
    return res
      .status(401)
      .json({ error: 'Invalid Google login', details: err.message })
  }
}

export const signup = async (req, res) => {
  try {
    const { idToken, name } = req.body
    if (!idToken) {
      return res.status(400).json({ error: 'Missing idToken' })
    }

    const decoded = await adminAuth.verifyIdToken(idToken)
    const { email, uid } = decoded

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const user = await User.create({
      firebaseUid: uid,
      email,
      name: name || decoded.name || email,
    })

    await issueSessionCookie(res, idToken)
    return res
      .status(201)
      .json({ id: user.id, email: user.email, name: user.name })
  } catch (err) {
    console.error('Signup error:', err)
    return res.status(500).json({ error: 'Server error', details: err.message })
  }
}
