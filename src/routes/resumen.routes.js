// ===== Imports =====
const express = require("express");
const router = express.Router();

// ===== Middleware =====
const autenticar = require("../middlewares/auth.middleware");

// ===== Controladores =====
const { mensual } = require("../controllers/resumen.controller");

// ===== Rutas =====
router.get("/mensual", autenticar, mensual);

// ===== Export =====
module.exports = router;
