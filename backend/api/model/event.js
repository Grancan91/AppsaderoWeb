import { DataTypes } from 'sequelize'
import sequelize from '../../db.js'

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  creatorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  lugar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latitud: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitud: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  fechaHora: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  capacidadMaxima: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  privacidad: {
    type: DataTypes.ENUM('public', 'private', 'invite_only'),
    allowNull: false,
    defaultValue: 'public',
  },
  estado: {
    type: DataTypes.ENUM('draft', 'published', 'cancelled', 'finished'),
    allowNull: false,
    defaultValue: 'draft',
  },
})

export default Event
