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

export async function createEvent(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const {
      nombre,
      descripcion,
      lugar,
      direccion,
      latitud,
      longitud,
      fechaHora,
      imagen,
      capacidadMaxima,
      privacidad,
      estado,
    } = req.body

    if (!nombre || !lugar || !fechaHora) {
      return res
        .status(400)
        .json({ error: 'nombre, lugar y fechaHora son requeridos' })
    }

    const event = await Event.create({
      creatorId: dbUser.id,
      nombre,
      descripcion,
      lugar,
      direccion,
      latitud,
      longitud,
      fechaHora,
      imagen,
      capacidadMaxima,
      privacidad: privacidad || 'public',
      estado: estado || 'draft',
    })

    await EventParticipant.create({
      userId: dbUser.id,
      eventId: event.id,
      role: 'creator',
      status: 'confirmed',
      joinedAt: new Date(),
    })

    return res.status(201).json({ event })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al crear el evento', err })
  }
}

export async function getMyEvents(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)

    const participations = await EventParticipant.findAll({
      where: {
        userId: dbUser.id,
        status: { [Op.notIn]: ['removed'] },
      },
      include: [
        {
          model: Event,
          as: 'event',
          include: [
            { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
          ],
        },
      ],
      order: [[{ model: Event, as: 'event' }, 'fechaHora', 'ASC']],
    })

    const events = participations.map((p) => ({
      ...p.event.toJSON(),
      myRole: p.role,
      myStatus: p.status,
    }))

    return res.json({ events })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al obtener los eventos' })
  }
}

export async function getEventById(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { eventId } = req.params

    const event = await Event.findByPk(eventId, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    })

    if (!event) return res.status(404).json({ error: 'Evento no encontrado' })

    if (event.privacidad !== 'public') {
      const myParticipation = await EventParticipant.findOne({
        where: {
          userId: dbUser.id,
          eventId,
          status: { [Op.notIn]: ['removed', 'declined'] },
        },
      })
      if (!myParticipation) {
        return res.status(403).json({ error: 'No tienes acceso a este evento' })
      }
    }

    const confirmedCount = await EventParticipant.count({
      where: { eventId, status: 'confirmed' },
    })

    return res.json({ event: { ...event.toJSON(), confirmedCount } })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al obtener el evento' })
  }
}

export async function updateEvent(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { eventId } = req.params

    const event = await Event.findByPk(eventId)
    if (!event) return res.status(404).json({ error: 'Evento no encontrado' })

    const organizer = await resolveOrganizer(dbUser.id, eventId)
    if (!organizer) {
      return res
        .status(403)
        .json({ error: 'No tienes permisos para editar este evento' })
    }

    const allowedFields = [
      'nombre',
      'descripcion',
      'lugar',
      'direccion',
      'latitud',
      'longitud',
      'fechaHora',
      'imagen',
      'capacidadMaxima',
      'privacidad',
      'estado',
    ]
    const updates = {}
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    }

    await event.update(updates)
    return res.json({ event })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al actualizar el evento', err })
  }
}

export async function deleteEvent(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { eventId } = req.params

    const event = await Event.findByPk(eventId)
    if (!event) return res.status(404).json({ error: 'Evento no encontrado' })

    if (event.creatorId !== dbUser.id) {
      return res
        .status(403)
        .json({ error: 'Solo el creador puede eliminar el evento' })
    }

    // Participants e invitations se eliminan por onDelete: CASCADE en las asociaciones
    await event.destroy()
    return res.json({ message: 'Evento eliminado correctamente' })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al eliminar el evento' })
  }
}
