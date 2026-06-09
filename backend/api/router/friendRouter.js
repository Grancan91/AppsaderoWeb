import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {
  sendFriendRequest,
  getMyFriends,
  getPendingRequests,
  getPendingSent,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  blockUser,
} from '../controller/friendController.js'

const router = Router()

router.use(authMiddleware)

// Rutas fijas primero para que no sean capturadas por /:friendId
router.post('/request', sendFriendRequest)
router.post('/block', blockUser)
router.get('/', getMyFriends)
router.get('/pending', getPendingRequests)
router.get('/pending/sent', getPendingSent)

// Rutas con parámetro después
router.patch('/:friendId/accept', acceptFriendRequest)
router.patch('/:friendId/decline', declineFriendRequest)
router.delete('/:friendId', removeFriend)

export default router
