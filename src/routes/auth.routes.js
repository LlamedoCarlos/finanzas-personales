// ===== Imports =====
const express = require('express');
const router = express.Router();

// ===== Controladores =====
const { registrar, login } = require('../controllers/auth.controller');

// ===== Rutas =====
router.post('/registro', registrar);
router.post('/login', login);

// ===== Export =====
module.exports = router;