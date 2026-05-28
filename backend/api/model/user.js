import { DataTypes } from 'sequelize'
import sequelize from '../db.js'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
})

export default User
