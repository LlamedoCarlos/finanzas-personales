// ===== Imports =====
const express = require("express");
const router = express.Router();

// ===== Middleware =====
const autenticar = require("../middlewares/auth.middleware");

// ===== Controladores =====
const {
	listar,
	crear,
	actualizar,
	eliminar,
} = require("../controllers/transacciones.controller");

// ===== Rutas =====
router.get("/", autenticar, listar);
router.post("/", autenticar, crear);
router.put("/:id", autenticar, actualizar);
router.delete("/:id", autenticar, eliminar);

// ===== Export =====
module.exports = router;
