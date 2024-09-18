import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: 'YOUR_ACCESS_TOKEN' });

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
        const body = {
            items: [{
                title: req.body.title,
                quantity: Number(req.body.quantity),
                unit_price: Number(req.body.priceFloat),
                total_amount: Number(req.body.itemtotal),
                currency_id: 'ARS'
            }],
            back_urls: {
                success: 'https://www.youtube.com/',
                failure: 'https://www.youtube.com/',
                pending: 'https://www.youtube.com/'
            },
            auto_return: 'approved'
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({
            id: result.id,
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
