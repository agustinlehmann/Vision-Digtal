const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); // Importa la configuración de Multer
const {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
    filtrarProductosPorDetalle
} = require('../controllers/productoController');

// Carga de archivos para crear un producto
router.post('/', upload.single('imagen'), crearProducto);

// Carga de archivos para actualizar un producto
router.put('/:id', upload.single('imagen'), actualizarProducto);

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.delete('/:id', eliminarProducto);
router.get('/filtrar', filtrarProductosPorDetalle);

module.exports = router;
