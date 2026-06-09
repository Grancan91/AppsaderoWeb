import { Op } from 'sequelize'
import { User, Friend } from '../associations/index.js'

const USER_ATTRS = ['id', 'name', 'email']

async function resolveDbUser(firebaseUid) {
  const user = await User.findOne({ where: { firebaseUid } })
  if (!user) throw { status: 401, error: 'Usuario no encontrado' }
  return user
}

// Devuelve el registro de amistad entre dos usuarios en cualquier dirección
async function findBetween(idA, idB) {
  return Friend.findOne({
    where: {
      [Op.or]: [
        { requesterId: idA, addresseeId: idB },
        { requesterId: idB, addresseeId: idA },
      ],
    },
  })
}

// POST /api/friends/request  { addresseeId }
export async function sendFriendRequest(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { addresseeId } = req.body

    if (!addresseeId) return res.status(400).json({ error: 'addresseeId es requerido' })
    if (addresseeId === dbUser.id) return res.status(400).json({ error: 'No puedes enviarte una solicitud a ti mismo' })

    const target = await User.findByPk(addresseeId, { attributes: USER_ATTRS })
    if (!target) return res.status(404).json({ error: 'Usuario no encontrado' })

    const existing = await findBetween(dbUser.id, addresseeId)

    if (existing) {
      if (existing.status === 'blocked') {
        return res.status(403).json({ error: 'No puedes enviar una solicitud a este usuario' })
      }
      if (existing.status === 'accepted') {
        return res.status(409).json({ error: 'Ya sois amigos' })
      }
      if (existing.status === 'pending') {
        if (existing.requesterId === dbUser.id) {
          return res.status(409).json({ error: 'Ya has enviado una solicitud de amistad' })
        }
        return res.status(409).json({ error: 'Esta persona ya te envió una solicitud. Puedes aceptarla en tus solicitudes pendientes.' })
      }
      // declined → eliminar y re-enviar
      if (existing.status === 'declined') {
        await existing.destroy()
      }
    }

    const friend = await Friend.create({
      requesterId: dbUser.id,
      addresseeId,
      status: 'pending',
    })

    return res.status(201).json({ friend })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al enviar la solicitud' })
  }
}

// GET /api/friends  — amistades aceptadas
export async function getMyFriends(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)

    const friends = await Friend.findAll({
      where: {
        [Op.or]: [{ requesterId: dbUser.id }, { addresseeId: dbUser.id }],
        status: 'accepted',
      },
      include: [
        { model: User, as: 'requester', attributes: USER_ATTRS },
        { model: User, as: 'addressee', attributes: USER_ATTRS },
      ],
      order: [['createdAt', 'DESC']],
    })

    return res.json({ friends })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al obtener amigos' })
  }
}

// GET /api/friends/pending  — solicitudes recibidas
export async function getPendingRequests(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)

    const requests = await Friend.findAll({
      where: { addresseeId: dbUser.id, status: 'pending' },
      include: [{ model: User, as: 'requester', attributes: USER_ATTRS }],
      order: [['createdAt', 'DESC']],
    })

    return res.json({ requests })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al obtener solicitudes' })
  }
}

// GET /api/friends/pending/sent  — solicitudes enviadas
export async function getPendingSent(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)

    const sent = await Friend.findAll({
      where: { requesterId: dbUser.id, status: 'pending' },
      include: [{ model: User, as: 'addressee', attributes: USER_ATTRS }],
      order: [['createdAt', 'DESC']],
    })

    return res.json({ sent })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al obtener solicitudes enviadas' })
  }
}

// PATCH /api/friends/:friendId/accept
export async function acceptFriendRequest(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { friendId } = req.params

    const friend = await Friend.findByPk(friendId)
    if (!friend) return res.status(404).json({ error: 'Solicitud no encontrada' })
    if (friend.addresseeId !== dbUser.id) return res.status(403).json({ error: 'No puedes aceptar esta solicitud' })
    if (friend.status !== 'pending') return res.status(400).json({ error: 'La solicitud no está pendiente' })

    await friend.update({ status: 'accepted' })
    return res.json({ friend })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al aceptar la solicitud' })
  }
}

// PATCH /api/friends/:friendId/decline
export async function declineFriendRequest(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { friendId } = req.params

    const friend = await Friend.findByPk(friendId)
    if (!friend) return res.status(404).json({ error: 'Solicitud no encontrada' })
    if (friend.addresseeId !== dbUser.id) return res.status(403).json({ error: 'No puedes rechazar esta solicitud' })
    if (friend.status !== 'pending') return res.status(400).json({ error: 'La solicitud no está pendiente' })

    await friend.update({ status: 'declined' })
    return res.json({ message: 'Solicitud rechazada' })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al rechazar la solicitud' })
  }
}

// DELETE /api/friends/:friendId
export async function removeFriend(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { friendId } = req.params

    const friend = await Friend.findByPk(friendId)
    if (!friend) return res.status(404).json({ error: 'Amistad no encontrada' })

    const isParty = friend.requesterId === dbUser.id || friend.addresseeId === dbUser.id
    if (!isParty) return res.status(403).json({ error: 'No puedes eliminar esta amistad' })

    await friend.destroy()
    return res.json({ message: 'Amistad eliminada' })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al eliminar la amistad' })
  }
}

// POST /api/friends/block  { addresseeId }
export async function blockUser(req, res) {
  try {
    const dbUser = await resolveDbUser(req.user.uid)
    const { addresseeId } = req.body

    if (!addresseeId) return res.status(400).json({ error: 'addresseeId es requerido' })
    if (addresseeId === dbUser.id) return res.status(400).json({ error: 'No puedes bloquearte a ti mismo' })

    const existing = await findBetween(dbUser.id, addresseeId)

    if (existing) {
      await existing.update({ status: 'blocked' })
    } else {
      await Friend.create({ requesterId: dbUser.id, addresseeId, status: 'blocked' })
    }

    return res.json({ message: 'Usuario bloqueado' })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error })
    console.error(err)
    return res.status(500).json({ error: 'Error al bloquear el usuario' })
  }
}
