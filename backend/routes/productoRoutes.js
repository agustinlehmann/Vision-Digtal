import express from 'express';
import upload from '../config/multerConfig.js';

import {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
    filtrarProductosPorDetalle
} from '../controllers/productoController.js';

const router = express.Router();

// Carga de archivos para crear un producto
router.post('/', upload.single('imagen'), crearProducto);

// Carga de archivos para actualizar un producto
router.put('/:id', upload.single('imagen'), actualizarProducto);

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.delete('/:id', eliminarProducto);
router.get('/filtrar', filtrarProductosPorDetalle);

export default router; // Exporta el enrutador con el nombre correcto
