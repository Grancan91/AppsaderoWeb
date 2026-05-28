import { adminAuth } from '../../firebaseAdmin.js'

const authMiddleware = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies.session
    if (!sessionCookie) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
    req.user = decodedClaims
    next()
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'No autorizado' })
  }
}

export default authMiddleware
