import { DataTypes } from 'sequelize';
import { bd } from '../config/bd.js';
import Usuario from './Usuario.js'; // Asegúrate de que la ruta sea correcta

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
  productos: {
    type: DataTypes.JSON, // Almacenar los productos como JSON
    allowNull: false
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM, // Usar ENUM para los estados
    values: ['pendiente', 'en_proceso', 'enviado', 'entregado', 'cancelado'],
    allowNull: false,
    defaultValue: 'pendiente' // Valor por defecto
  }
}, {
  tableName: 'Pedido',
  timestamps: false
});

Pedido.sync();
export default Pedido;
