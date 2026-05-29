import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { createEvent, getMyEvents, getEventById, updateEvent, deleteEvent } from '../controller/eventController.js'
import { getEventParticipants, updateParticipantStatus, removeParticipant } from '../controller/participantController.js'
import {
  inviteUser,
  inviteByEmail,
  createInviteLink,
  getEventInvitations,
  revokeInvitation,
} from '../controller/invitationController.js'

const router = Router()

router.use(authMiddleware)

// Events CRUD
router.post('/', createEvent)
router.get('/my', getMyEvents)
router.get('/:eventId', getEventById)
router.patch('/:eventId', updateEvent)
router.delete('/:eventId', deleteEvent)

// Participants
router.get('/:eventId/participants', getEventParticipants)
router.patch('/:eventId/participants/:userId', updateParticipantStatus)
router.delete('/:eventId/participants/:userId', removeParticipant)

// Invitations (scoped to event)
router.get('/:eventId/invitations', getEventInvitations)
router.post('/:eventId/invitations/user', inviteUser)
router.post('/:eventId/invitations/email', inviteByEmail)
router.post('/:eventId/invitations/link', createInviteLink)
router.delete('/:eventId/invitations/:invitationId', revokeInvitation)

export default router
