const express = require("express");
const router = express.Router();
const autenticar = require("../middlewares/auth.middleware");
const { listar, crear, actualizar, eliminar } = require("../controllers/categorias.controller");
router.get("/", autenticar, listar);
router.post("/", autenticar, crear);
router.put("/:id", autenticar, actualizar);
router.delete("/:id", autenticar, eliminar);
module.exports = router;