import crypto from 'crypto'
import { Op } from 'sequelize'
import { User, Event, EventParticipant, Invitation } from '../associations/index.js'

async function resolveDbUser(firebaseUid) {
  const user = await User.findOne({ where: { firebaseUid } })
  if (!user) throw { status: 401, error: 'Usuario no encontrado' }
  return user
}

async function resolveOrganizer(userId, eventId) {
  return EventParticipant.findOne({
    where: {
      userId,
      eventId,
      role: { [Op.in]: ['creator', 'co_host'] },
      status: { [Op.notIn]: ['removed', 'declined'] },
    },
  })
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

async function hasCapacity(eventId) {
  const event = await Event.findByPk(eventId, { attributes: ['capacidadMaxima'] })
  if (!event.capacidadMaxima) return true
  const confirmed = await EventParticipant.count({ where: { eventId, status: 'confirmed' } })
  return confirmed < event.capacidadMaxima
}

// POST /api/events/:eventId/invitations/user
// Invita a un usuario registrado por su userId. Crea EventParticipant(invited) de forma inmediata.
export async function inviteUser(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { eventId } = req.params
    const { userId: targetUserId, mensaje } = req.body

    if (!targetUserId) return res.status(400).json({ error: 'userId es requerido' })
    if (targetUserId === dbUser.id) return res.status(400).json({ error: 'No puedes invitarte a ti mismo' })

    const event = await Event.findByPk(eventId)
    if (!event) return res.status(404).json({ error: 'Evento no encontrado' })

    const isOrganizer = await resolveOrganizer(dbUser.id, eventId)
    if (!isOrganizer) return res.status(403).json({ error: 'No tienes permisos para invitar' })

    const targetUser = await User.findByPk(targetUserId)
    if (!targetUser) return res.status(404).json({ error: 'Usuario no encontrado' })

    const existingInvitation = await Invitation.findOne({
      where: {
        eventId,
        invitedUserId: targetUserId,
        status: { [Op.in]: ['pending', 'accepted'] },
      },
    })
    if (existingInvitation) {
      return res.status(409).json({ error: 'Ya existe una invitación activa para este usuario' })
    }

    const existingParticipant = await EventParticipant.findOne({
      where: {
        eventId,
        userId: targetUserId,
        status: { [Op.notIn]: ['removed', 'declined'] },
      },
    })
    if (existingParticipant) {
      return res.status(409).json({ error: 'El usuario ya es participante del evento' })
    }

    const token = generateToken()
    const invitation = await Invitation.create({
      eventId,
      inviterId: dbUser.id,
      invitedUserId: targetUserId,
      token,
      mensaje,
      tipo: 'direct_user',
      status: 'pending',
    })

    // Pre-create participant con status invited para que aparezca en la lista
    await EventParticipant.create({
      userId: targetUserId,
      eventId,
      role: 'guest',
      status: 'invited',
      invitedBy: dbUser.id,
    })

    return res.status(201).json({ invitation })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al crear la invitación' })
  }
}

// POST /api/events/:eventId/invitations/email
// Invita por email. El EventParticipant se crea al aceptar, no antes (el usuario puede no existir aún).
export async function inviteByEmail(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { eventId } = req.params
    const { email, mensaje } = req.body

    if (!email) return res.status(400).json({ error: 'email es requerido' })
    const emailLower = email.toLowerCase().trim()

    const event = await Event.findByPk(eventId)
    if (!event) return res.status(404).json({ error: 'Evento no encontrado' })

    const isOrganizer = await resolveOrganizer(dbUser.id, eventId)
    if (!isOrganizer) return res.status(403).json({ error: 'No tienes permisos para invitar' })

    const existingEmailInvitation = await Invitation.findOne({
      where: {
        eventId,
        invitedEmail: emailLower,
        status: { [Op.in]: ['pending', 'accepted'] },
      },
    })
    if (existingEmailInvitation) {
      return res.status(409).json({ error: 'Ya existe una invitación activa para este email' })
    }

    // Si el email corresponde a un usuario registrado, verificar también invitaciones directas
    const registeredUser = await User.findOne({ where: { email: emailLower } })
    if (registeredUser) {
      const existingDirect = await Invitation.findOne({
        where: {
          eventId,
          invitedUserId: registeredUser.id,
          status: { [Op.in]: ['pending', 'accepted'] },
        },
      })
      if (existingDirect) {
        return res.status(409).json({ error: 'Este usuario ya tiene una invitación activa' })
      }

      const existingParticipant = await EventParticipant.findOne({
        where: {
          eventId,
          userId: registeredUser.id,
          status: { [Op.notIn]: ['removed', 'declined'] },
        },
      })
      if (existingParticipant) {
        return res.status(409).json({ error: 'Este usuario ya es participante del evento' })
      }
    }

    const token = generateToken()
    const invitation = await Invitation.create({
      eventId,
      inviterId: dbUser.id,
      invitedUserId: registeredUser?.id || null,
      invitedEmail: emailLower,
      token,
      mensaje,
      tipo: 'email',
      status: 'pending',
    })

    return res.status(201).json({ invitation })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al crear la invitación por email' })
  }
}

// POST /api/events/:eventId/invitations/link
// Genera un enlace compartible. Cualquier usuario autenticado puede usarlo para unirse.
export async function createInviteLink(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { eventId } = req.params
    const { mensaje, expiresAt } = req.body

    const event = await Event.findByPk(eventId)
    if (!event) return res.status(404).json({ error: 'Evento no encontrado' })

    const isOrganizer = await resolveOrganizer(dbUser.id, eventId)
    if (!isOrganizer) return res.status(403).json({ error: 'No tienes permisos para crear un enlace' })

    const token = generateToken()
    const invitation = await Invitation.create({
      eventId,
      inviterId: dbUser.id,
      token,
      mensaje,
      tipo: 'link',
      status: 'pending',
      expiresAt: expiresAt || null,
    })

    return res.status(201).json({ invitation, inviteUrl: `/invite/${token}` })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al crear el enlace de invitación' })
  }
}

// GET /api/events/:eventId/invitations
export async function getEventInvitations(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { eventId } = req.params

    const event = await Event.findByPk(eventId)
    if (!event) return res.status(404).json({ error: 'Evento no encontrado' })

    const isOrganizer = await resolveOrganizer(dbUser.id, eventId)
    if (!isOrganizer) return res.status(403).json({ error: 'No tienes permisos para ver las invitaciones' })

    const invitations = await Invitation.findAll({
      where: { eventId },
      include: [
        { model: User, as: 'inviter', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'invitedUser', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    })

    return res.json({ invitations })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al obtener las invitaciones' })
  }
}

// POST /api/invitations/:token/accept
export async function acceptInvitation(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { token } = req.params

    const invitation = await Invitation.findOne({ where: { token } })
    if (!invitation) return res.status(404).json({ error: 'Invitación no encontrada' })

    if (invitation.status === 'revoked') {
      return res.status(400).json({ error: 'La invitación ha sido revocada' })
    }
    if (invitation.status === 'declined') {
      return res.status(400).json({ error: 'La invitación ya fue rechazada' })
    }
    if (invitation.status === 'expired') {
      return res.status(400).json({ error: 'La invitación ha expirado' })
    }
    // Los links son reutilizables; direct_user y email solo se aceptan una vez
    if (invitation.tipo !== 'link' && invitation.status === 'accepted') {
      return res.status(400).json({ error: 'La invitación ya fue aceptada' })
    }

    if (invitation.expiresAt && new Date() > new Date(invitation.expiresAt)) {
      await invitation.update({ status: 'expired' })
      return res.status(400).json({ error: 'La invitación ha expirado' })
    }

    // Verificar que el usuario sea el destinatario correcto
    if (invitation.tipo === 'direct_user') {
      if (invitation.invitedUserId !== dbUser.id) {
        return res.status(403).json({ error: 'Esta invitación no es para ti' })
      }
    } else if (invitation.tipo === 'email') {
      if (dbUser.email.toLowerCase() !== invitation.invitedEmail.toLowerCase()) {
        return res.status(403).json({ error: 'Esta invitación no corresponde a tu email' })
      }
      // Vincular la cuenta al aceptar si no estaba vinculada
      if (!invitation.invitedUserId) {
        await invitation.update({ invitedUserId: dbUser.id })
      }
    }
    // tipo === 'link': cualquier usuario autenticado puede unirse

    const capacity = await hasCapacity(invitation.eventId)
    if (!capacity) {
      return res.status(409).json({ error: 'El evento ha alcanzado su capacidad máxima' })
    }

    const [participant, created] = await EventParticipant.findOrCreate({
      where: { userId: dbUser.id, eventId: invitation.eventId },
      defaults: {
        role: 'guest',
        status: 'confirmed',
        invitedBy: invitation.inviterId,
        joinedAt: new Date(),
      },
    })

    if (!created) {
      if (participant.status === 'confirmed') {
        return res.status(409).json({ error: 'Ya eres participante confirmado de este evento' })
      }
      await participant.update({ status: 'confirmed', joinedAt: new Date() })
    }

    // Los links permanecen pending para que otros los puedan usar
    if (invitation.tipo !== 'link') {
      await invitation.update({ status: 'accepted', acceptedAt: new Date() })
    }

    return res.json({ message: 'Invitación aceptada', participant })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al aceptar la invitación' })
  }
}

// POST /api/invitations/:token/decline
export async function declineInvitation(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { token } = req.params

    const invitation = await Invitation.findOne({ where: { token } })
    if (!invitation) return res.status(404).json({ error: 'Invitación no encontrada' })

    if (invitation.tipo === 'link') {
      return res.status(400).json({ error: 'No puedes rechazar un enlace de invitación' })
    }
    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'La invitación no está en estado pendiente' })
    }

    if (invitation.tipo === 'direct_user' && invitation.invitedUserId !== dbUser.id) {
      return res.status(403).json({ error: 'Esta invitación no es para ti' })
    }
    if (invitation.tipo === 'email' && dbUser.email.toLowerCase() !== invitation.invitedEmail.toLowerCase()) {
      return res.status(403).json({ error: 'Esta invitación no corresponde a tu email' })
    }

    await invitation.update({ status: 'declined' })

    // Actualizar EventParticipant si se creó al invitar (tipo direct_user)
    const participant = await EventParticipant.findOne({
      where: { userId: dbUser.id, eventId: invitation.eventId, status: 'invited' },
    })
    if (participant) {
      await participant.update({ status: 'declined' })
    }

    return res.json({ message: 'Invitación rechazada' })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al rechazar la invitación' })
  }
}

// DELETE /api/events/:eventId/invitations/:invitationId
export async function revokeInvitation(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { eventId, invitationId } = req.params

    const isOrganizer = await resolveOrganizer(dbUser.id, eventId)
    if (!isOrganizer) return res.status(403).json({ error: 'No tienes permisos para revocar invitaciones' })

    const invitation = await Invitation.findOne({ where: { id: invitationId, eventId } })
    if (!invitation) return res.status(404).json({ error: 'Invitación no encontrada' })

    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'Solo se pueden revocar invitaciones pendientes' })
    }

    await invitation.update({ status: 'revoked' })

    // Si era direct_user, revertir el EventParticipant pre-creado
    if (invitation.invitedUserId) {
      const participant = await EventParticipant.findOne({
        where: { userId: invitation.invitedUserId, eventId, status: 'invited' },
      })
      if (participant) await participant.update({ status: 'removed' })
    }

    return res.json({ message: 'Invitación revocada correctamente' })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al revocar la invitación' })
  }
}
