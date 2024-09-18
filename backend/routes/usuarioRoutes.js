import express from 'express';
import {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
    iniciarSesion,
    verificarToken
} from '../controllers/usuarioController.js'; // Ajusta la importación

const router = express.Router();

router.post('/', crearUsuario);
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

router.post('/iniciar-sesion', iniciarSesion);
router.post('/validar', verificarToken);

export default router; // Cambia a `router` en lugar de `usuarioRoutes`
