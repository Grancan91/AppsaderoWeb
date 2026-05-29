import { Router } from 'express'
import authRouter from './authRouter.js'
import userRouter from './userRouter.js'
import eventRouter from './eventRouter.js'
import invitationRouter from './invitationRouter.js'

const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/events', eventRouter)
router.use('/invitations', invitationRouter)

export default router
