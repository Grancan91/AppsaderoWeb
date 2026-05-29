import { DataTypes } from 'sequelize'
import sequelize from '../../db.js'

const Invitation = sequelize.define('Invitation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  inviterId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  // null para tipo 'link', null hasta que acepte para tipo 'email'
  invitedUserId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  // solo para tipo 'email'
  invitedEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  token: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tipo: {
    type: DataTypes.ENUM('email', 'link', 'direct_user'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined', 'expired', 'revoked'),
    allowNull: false,
    defaultValue: 'pending',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  acceptedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
})

export default Invitation
