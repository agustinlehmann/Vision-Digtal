import Producto from '../models/Producto.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize'; // Asegúrate de importar Op para filtrar

const crearProducto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Errores de validación:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const nombre_producto = req.body.nombre_producto;
        const precio = parseFloat(req.body.precio);
        const stock = parseInt(req.body.stock, 10);
        const detalle = req.body.detalle;
        const detallar = req.body.detallar; // Obtener el nuevo campo
        const imagen = req.file ? req.file.path : null;

        if (!nombre_producto || isNaN(precio) || isNaN(stock) || !detalle || !detallar) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        if (typeof nombre_producto !== 'string' || typeof detalle !== 'string' || typeof detallar !== 'string') {
            return res.status(400).json({ error: 'Datos inválidos', detalles: { nombre_producto, precio, stock, detalle, detallar, imagen } });
        }

        if (precio <= 0 || stock < 0) {
            return res.status(400).json({ error: 'El precio debe ser mayor a 0 y el stock no puede ser negativo' });
        }

        const nuevoProducto = await Producto.create({
            nombre_producto,
            precio,
            stock,
            detalle,
            detallar, // Incluir el nuevo campo
            imagen
        });
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

// Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// Actualizar un producto por ID
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nombre_producto, precio, stock, detalle, detallar } = req.body;
        const imagen = req.file ? req.file.path : null;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        producto.nombre_producto = nombre_producto || producto.nombre_producto;
        producto.precio = precio || producto.precio;
        producto.stock = stock || producto.stock;
        producto.detalle = detalle || producto.detalle;
        producto.detallar = detallar || producto.detallar; // Actualizar el nuevo campo
        producto.imagen = imagen || producto.imagen;

        await producto.save();
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto por ID
const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await producto.destroy();
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

// Filtrar productos por detalle
const filtrarProductosPorDetalle = async (req, res) => {
    const { detalle } = req.query;

    if (!detalle) {
        return res.status(400).json({ error: 'El parámetro de búsqueda "detalle" es obligatorio' });
    }

    try {
        const productos = await Producto.findAll({
            where: {
                detalle: {
                    [Op.like]: `%${detalle}%`
                }
            }
        });

        if (productos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos con ese detalle' });
        }

        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al filtrar productos', details: error.message });
    }
};

export {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
    filtrarProductosPorDetalle
};
