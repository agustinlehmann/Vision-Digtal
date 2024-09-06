const { DataTypes } = require('sequelize');
const { bd } = require('../config/bd');

const Usuario = bd.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre_usuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Usuario', // Nombre de la tabla en la base de datos
  timestamps: false // Deshabilitar timestamps si no los necesitas
});

Usuario.sync();
module.exports = Usuario;
