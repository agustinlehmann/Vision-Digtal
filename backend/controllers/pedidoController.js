import { bd } from '../config/bd.js';
import Pedido from '../models/Pedido.js';
import Producto from '../models/Producto.js';
import { validationResult } from 'express-validator';

const crearPedido = async (req, res) => {
    const transaction = await bd.transaction();

    try {
        const { id_usuario, id_producto, cantidad, total, direccion, codigo_postal, ciudad, provincia } = req.body;

        // Validación de datos
        if (!id_usuario || !id_producto || cantidad === undefined || total === undefined || !direccion || !codigo_postal || !ciudad || !provincia) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        if (typeof id_usuario !== 'number' || typeof id_producto !== 'number' || typeof cantidad !== 'number' || typeof total !== 'number') {
            await transaction.rollback();
            return res.status(400).json({ error: 'Datos inválidos' });
        }

        // Verificación del producto
        const producto = await Producto.findByPk(id_producto, { transaction });
        if (!producto) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Verificación de stock
        if (producto.stock < cantidad) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Stock insuficiente' });
        }

        // Actualización de stock y creación de pedido
        producto.stock -= cantidad;
        await producto.save({ transaction });

        const nuevoPedido = await Pedido.create({
            id_usuario,
            id_producto,
            cantidad,
            total,
            direccion,
            codigo_postal,
            ciudad,
            provincia
        }, { transaction });

        await transaction.commit();
        res.status(201).json(nuevoPedido);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ error: 'Error al crear el pedido' });
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
        const { id_usuario, cantidad, total, direccion, codigo_postal, ciudad, provincia } = req.body;
        const pedido = await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        if (id_usuario !== undefined && typeof id_usuario !== 'number') {
            return res.status(400).json({ error: 'id_usuario debe ser un número' });
        }
        if (cantidad !== undefined && typeof cantidad !== 'number') {
            return res.status(400).json({ error: 'cantidad debe ser un número' });
        }
        if (total !== undefined && typeof total !== 'number') {
            return res.status(400).json({ error: 'total debe ser un número' });
        }

        pedido.id_usuario = id_usuario || pedido.id_usuario;
        pedido.cantidad = cantidad || pedido.cantidad;
        pedido.total = total || pedido.total;
        pedido.direccion = direccion || pedido.direccion;
        pedido.codigo_postal = codigo_postal || pedido.codigo_postal;
        pedido.ciudad = ciudad || pedido.ciudad;
        pedido.provincia = provincia || pedido.provincia;

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
