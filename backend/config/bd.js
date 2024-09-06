const { Sequelize } = require('sequelize');

// Configuración de la base de datos
const bd = new Sequelize('ecommerce', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

async function conectarBD() {
  try {
    // Conectar al servidor de base de datos
    await bd.authenticate();
    console.log('Connection has been established successfully.');

    // Crear la base de datos si no existe (si se prefiere)
    // await bd.query('CREATE DATABASE IF NOT EXISTS ecommerce');
    // console.log('Database created or already exists.');

    // Re-conectar a la base de datos
    bd.config.database = 'ecommerce'; // Cambiar la base de datos a la recién creada
    await bd.authenticate();
    console.log('Reconnected to the database successfully.');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { bd, conectarBD };
