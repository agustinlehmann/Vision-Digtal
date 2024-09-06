const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');


dotenv.config();

const productoRoutes = require('./routes/productoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Definición de rutas
app.use('/api/productos', productoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Ruta raíz opcional (para fines de prueba)
app.get('/', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
