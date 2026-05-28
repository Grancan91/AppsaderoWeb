import { Router } from 'express'

const router = Router()

router.post('/login', async (req, res) => {
res.send({ success: true, message: 'Login exitoso' })
})

export default router
