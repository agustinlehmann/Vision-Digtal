import { bd } from '../config/bd.js';
import Pedido from '../models/Pedido.js';
import Producto from '../models/Producto.js';
import { validationResult } from 'express-validator';
const crearPedido = async (req, res) => {
    const transaction = await bd.transaction();

    try {
        const { id_usuario, productos, direccion, codigo_postal, ciudad, provincia } = req.body;

        // Validación de datos
        if (!id_usuario || !productos || !Array.isArray(productos) || productos.length === 0 || !direccion || !codigo_postal || !ciudad || !provincia) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Validar y procesar cada producto
        const productoPromises = productos.map(async (item) => {
            const { id_producto, cantidad } = item;

            if (!id_producto || cantidad === undefined || typeof cantidad !== 'number') {
                throw new Error('Datos de productos inválidos');
            }

            // Verificación del producto
            const producto = await Producto.findByPk(id_producto, { transaction });
            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            // Verificación de stock
            if (producto.stock < cantidad) {
                throw new Error('Stock insuficiente');
            }

            // Actualización de stock
            producto.stock -= cantidad;
            await producto.save({ transaction });

            return { producto, cantidad }; // Devolver producto y cantidad
        });

        const productosDetails = await Promise.all(productoPromises);

        // Calcular total
        const total = productosDetails.reduce((acc, item) => {
            return acc + (item.producto.precio * item.cantidad);
        }, 0);

        // Crear el objeto del pedido con todos los datos
        const nuevoPedidoData = {
            id_usuario,
            productos: JSON.stringify(productos), // Guardamos los productos como un JSON string
            direccion,
            codigo_postal,
            ciudad,
            provincia,
            total
        };

        const nuevoPedido = await Pedido.create(nuevoPedidoData, { transaction });

        await transaction.commit();
        res.status(201).json(nuevoPedido);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ error: error.message || 'Error al crear el pedido' });
    }
};


const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll();
        res.status(200).json(pedidos);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
};

const obtenerPedidoPorId = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json(pedido);
    } catch (error) {
        console.error('Error al obtener el pedido:', error);
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
};

const actualizarPedido = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_usuario, cantidad, total, direccion, codigo_postal, ciudad, provincia, estado } = req.body; // Añadir estado al destructuring
        const pedido = await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        // Validaciones opcionales
        if (id_usuario !== undefined && typeof id_usuario !== 'number') {
            return res.status(400).json({ error: 'id_usuario debe ser un número' });
        }
        if (cantidad !== undefined && typeof cantidad !== 'number') {
            return res.status(400).json({ error: 'cantidad debe ser un número' });
        }
        if (total !== undefined && typeof total !== 'number') {
            return res.status(400).json({ error: 'total debe ser un número' });
        }
        if (estado !== undefined && typeof estado !== 'string') {
            return res.status(400).json({ error: 'estado debe ser un string' });
        }

        // Actualización de campos
        pedido.id_usuario = id_usuario || pedido.id_usuario;
        pedido.cantidad = cantidad || pedido.cantidad;
        pedido.total = total || pedido.total;
        pedido.direccion = direccion || pedido.direccion;
        pedido.codigo_postal = codigo_postal || pedido.codigo_postal;
        pedido.ciudad = ciudad || pedido.ciudad;
        pedido.provincia = provincia || pedido.provincia;
        pedido.estado = estado || pedido.estado; // Actualizar estado si se proporciona

        await pedido.save();
        res.status(200).json(pedido);
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
        res.status(500).json({ error: 'Error al actualizar el pedido' });
    }
};


const eliminarPedido = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const pedido = await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        await pedido.destroy();
        res.status(200).json({ message: 'Pedido eliminado' });
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
};


export {
    crearPedido,
    obtenerPedidos,
    obtenerPedidoPorId,
    actualizarPedido,
    eliminarPedido  
};
