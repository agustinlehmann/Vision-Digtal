const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Rutas para los pedidos
router.post('/', pedidoController.crearPedido); // Crear un nuevo pedido
router.get('/', pedidoController.obtenerPedidos); // Obtener todos los pedidos
router.get('/:id', pedidoController.obtenerPedidoPorId); // Obtener un pedido por ID
router.put('/:id', pedidoController.actualizarPedido); // Actualizar un pedido
router.delete('/:id', pedidoController.eliminarPedido); // Eliminar un pedido

module.exports = router;
