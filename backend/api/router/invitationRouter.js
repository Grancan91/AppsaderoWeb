import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { acceptInvitation, declineInvitation } from '../controller/invitationController.js'

const router = Router()

router.use(authMiddleware)

// Acciones por token — usadas desde email links o frontend tras login
router.post('/:token/accept', acceptInvitation)
router.post('/:token/decline', declineInvitation)

export default router
