import { DataTypes } from 'sequelize';
import { bd } from '../config/bd.js';

// Definir el modelo de Producto
const Producto = bd.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre_producto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  detalle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imagen: { // Campo para la ruta de la imagen
    type: DataTypes.STRING,
    allowNull: true
  },
  detallar: {
    type: DataTypes.STRING,
    allowNull: false // Asegúrate de que este campo es obligatorio
  }
}, {
  tableName: 'Producto',
  timestamps: false
});

// Sincronizar el modelo con la base de datos
Producto.sync();

export default Producto;
