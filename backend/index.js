import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// SDK de Mercado Pago
import mercadopago from 'mercadopago';

// Agrega credenciales usando el método correcto según la versión
mercadopago.configurations = {
    access_token: 'TEST-e6e86703-feb8-4555-a64c-5acf8bb55e21'
};

// Configura dotenv
dotenv.config();

// Importa las rutas
import productoRoutes from './routes/productoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Ruta para crear una preferencia de Mercado Pago
app.post('/api/create_preference', async (req, res) => {
    try {
        const preference = {
            items: [{
                title: req.body.title,
                quantity: Number(req.body.quantity),
                unit_price: Number(req.body.unit_price),

            }],
            back_urls: {
                success: 'https://www.youtube.com/',  // Cambia las URLs según tu necesidad
                failure: 'https://www.youtube.com/',
                pending: 'https://www.youtube.com/'
            },
            auto_return: 'approved',
            currency_id: 'ARS',
        };

        const result = await mercadopago.preferences.create(preference);
        res.json({
            id: result.body.id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error al generar la preferencia' });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
