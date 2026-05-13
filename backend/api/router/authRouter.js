import { Router } from "express"
const router = Router()

router.post('/login', () => console.log('Login endpoint called'))

export default router