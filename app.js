// ===== Imports =====
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/auth.routes');

// ===== Configuración de entorno =====
dotenv.config();

// ===== Configuración base =====
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ===== Ruta de prueba =====
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API está saludable' });
});

app.use('/api/auth', authRoutes);

module.exports = app;