import { Router } from "express"

const router = Router()

router
  .use('/auth', import('./auth.js'))

  export default router