import { Router } from 'express'
import { signup } from '../controller/authController.js'

const router = Router()

router
  .post('/login', async (req, res) => {
    res.send({ success: true, message: 'Login exitoso' })
  })
  .post('/signup', signup)

export default router
