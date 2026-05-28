import { Router } from 'express'
import { adminAuth } from '../controller/authController.js'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { idToken } = req.body

    // Verify that the token
    // was issued by Firebase.
    const decoded = await adminAuth.verifyIdToken(idToken)

    console.log('Usuario autenticado:', decoded.uid)

    // Session duration
    // (5 days).
    const expiresIn = 60 * 60 * 24 * 5 * 1000

    // Convert Firebase token
    // into backend session cookie.
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    })

    // Send secure cookie
    // to browser.
    res.cookie('session', sessionCookie, {
      httpOnly: true,

      secure: process.env.NODE_ENV === 'production',

      sameSite: 'lax',

      maxAge: expiresIn,
    })

    res.json({
      success: true,
      uid: decoded.uid,
      message: 'Usuario autenticado correctamente',
    })
  } catch (error) {
    console.error(error)

    res.status(401).json({
      success: false,
      message: 'Token inválido',
    })
  }
})

export default router
