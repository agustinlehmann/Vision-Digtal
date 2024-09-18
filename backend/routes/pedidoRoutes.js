import express from 'express';
import {
    crearPedido,
    obtenerPedidos,
    obtenerPedidoPorId,
    actualizarPedido,
    eliminarPedido
} from '../controllers/pedidoController.js'; // Usa exportaciones nombradas

const router = express.Router();

// Rutas para los pedidos
router.post('/', crearPedido); // Crear un nuevo pedido
router.get('/', obtenerPedidos); // Obtener todos los pedidos
router.get('/:id', obtenerPedidoPorId); // Obtener un pedido por ID
router.put('/:id', actualizarPedido); // Actualizar un pedido
router.delete('/:id', eliminarPedido); // Eliminar un pedido

export default router; // Exporta el router
