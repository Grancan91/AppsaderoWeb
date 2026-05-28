import { Router } from 'express'
import { signup, loginGoogle } from '../controller/authController.js'

const router = Router()

router.post('/login', loginGoogle).post('/signup', signup)

export default router
