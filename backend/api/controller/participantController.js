import { Op } from 'sequelize'
import { User, Event, EventParticipant } from '../associations/index.js'

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

export async function getEventParticipants(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { eventId } = req.params

    const event = await Event.findByPk(eventId)
    if (!event) return res.status(404).json({ error: 'Evento no encontrado' })

    // Eventos privados: solo participantes activos pueden ver la lista
    if (event.privacidad !== 'public') {
      const myParticipation = await EventParticipant.findOne({
        where: {
          userId: dbUser.id,
          eventId,
          status: { [Op.notIn]: ['removed', 'declined'] },
        },
      })
      if (!myParticipation) {
        return res.status(403).json({ error: 'No tienes acceso a los participantes de este evento' })
      }
    }

    const participants = await EventParticipant.findAll({
      where: { eventId, status: { [Op.notIn]: ['removed'] } },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'ASC']],
    })

    return res.json({ participants })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al obtener los participantes' })
  }
}

export async function updateParticipantStatus(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { eventId, userId: targetUserId } = req.params
    const { status, role } = req.body

    if (!status && !role) {
      return res.status(400).json({ error: 'Se requiere al menos status o role' })
    }

    const participant = await EventParticipant.findOne({
      where: { userId: targetUserId, eventId },
    })
    if (!participant) return res.status(404).json({ error: 'Participante no encontrado' })

    const isOrganizer = await resolveOrganizer(dbUser.id, eventId)
    const isOwnRecord = dbUser.id === targetUserId

    if (!isOrganizer && !isOwnRecord) {
      return res.status(403).json({ error: 'No tienes permisos para actualizar este participante' })
    }

    if (!isOrganizer && isOwnRecord) {
      // El usuario solo puede declinar su propia invitación
      if (status && status !== 'declined') {
        return res.status(403).json({ error: 'Solo puedes declinar tu propia invitación desde aquí' })
      }
      if (role) {
        return res.status(403).json({ error: 'No puedes cambiar tu propio rol' })
      }
    }

    const validStatuses = ['invited', 'pending_payment', 'confirmed', 'declined', 'removed']
    const validRoles = ['creator', 'co_host', 'guest']

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Estado inválido. Valores válidos: ${validStatuses.join(', ')}` })
    }
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: `Rol inválido. Valores válidos: ${validRoles.join(', ')}` })
    }

    const updates = {}
    if (status) updates.status = status
    if (role && isOrganizer) updates.role = role
    if (status === 'confirmed' && !participant.joinedAt) updates.joinedAt = new Date()

    await participant.update(updates)
    return res.json({ participant })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al actualizar el participante' })
  }
}

export async function removeParticipant(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { eventId, userId: targetUserId } = req.params

    const event = await Event.findByPk(eventId)
    if (!event) return res.status(404).json({ error: 'Evento no encontrado' })

    const isOrganizer = await resolveOrganizer(dbUser.id, eventId)
    if (!isOrganizer) {
      return res.status(403).json({ error: 'Solo los organizadores pueden eliminar participantes' })
    }

    const participant = await EventParticipant.findOne({
      where: { userId: targetUserId, eventId },
    })
    if (!participant) return res.status(404).json({ error: 'Participante no encontrado' })

    if (participant.role === 'creator') {
      return res.status(400).json({ error: 'No puedes eliminar al creador del evento' })
    }

    await participant.update({ status: 'removed' })
    return res.json({ message: 'Participante eliminado correctamente' })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al eliminar el participante' })
  }
}
