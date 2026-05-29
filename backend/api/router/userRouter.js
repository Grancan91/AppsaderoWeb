import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { getProfile, updateProfile, deleteAccount } from '../controller/userController.js'

const router = Router()

router.use(authMiddleware)

router
  .get('/profile', getProfile)
  .patch('/profile', updateProfile)
  .delete('/account', deleteAccount)

export default router
