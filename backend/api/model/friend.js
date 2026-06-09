import { DataTypes } from 'sequelize'
import sequelize from '../../db.js'

const Friend = sequelize.define('Friend', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  requesterId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  addresseeId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined', 'blocked'),
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['requesterId', 'addresseeId'],
    },
  ],
})

export default Friend
