const { DataTypes } = require('sequelize');
const { bd } = require('../config/bd');
const Usuario = require('./Usuario'); // Asegúrate de que la ruta sea correcta
const Producto = require('./Producto'); // Asegúrate de que la ruta sea correcta

const Pedido = bd.define('Pedido', {
  id_pedido: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  codigo_postal: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ciudad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  provincia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,
      key: 'id_producto'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Pedido', // Nombre de la tabla en la base de datos
  timestamps: false // Deshabilitar timestamps si no los necesitas
});
Pedido.sync();
module.exports = Pedido;
