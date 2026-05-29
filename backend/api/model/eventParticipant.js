import { DataTypes } from 'sequelize'
import sequelize from '../../db.js'

const EventParticipant = sequelize.define('EventParticipant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('creator', 'co_host', 'guest'),
    allowNull: false,
    defaultValue: 'guest',
  },
  status: {
    type: DataTypes.ENUM('invited', 'pending_payment', 'confirmed', 'declined', 'removed'),
    allowNull: false,
    defaultValue: 'invited',
  },
  // FK a User — quién envió la invitación
  invitedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  joinedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'eventId'],
    },
  ],
})

export default EventParticipant
