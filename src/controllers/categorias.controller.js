// ===== Imports =====
const pool = require("../config/db");

// ===== Listar categorías =====
const listar = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre, tipo FROM categorias WHERE usuario_id = $1 ORDER BY id DESC",
      [req.usuario.id]
    );
    return res.json({ categorias: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ===== Crear categoría =====
const crear = async (req, res) => {
  try {
    const { nombre, tipo } = req.body;
    if (!nombre || !tipo) {
      return res.status(400).json({ error: "Faltan datos" });
    }
    const result = await pool.query(
      "INSERT INTO categorias (usuario_id, nombre, tipo) VALUES ($1, $2, $3) RETURNING id, nombre, tipo",
      [req.usuario.id, nombre, tipo]
    );
    return res.status(201).json({ categoria: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ===== Actualizar categoría =====
const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo } = req.body;
    if (!nombre || !tipo) {
      return res.status(400).json({ error: "Faltan datos" });
    }
    const result = await pool.query(
      "UPDATE categorias SET nombre = $1, tipo = $2 WHERE id = $3 AND usuario_id = $4 RETURNING id, nombre, tipo",
      [nombre, tipo, id, req.usuario.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    return res.json({ categoria: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ===== Eliminar categoría =====
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM categorias WHERE id = $1 AND usuario_id = $2 RETURNING id",
      [id, req.usuario.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ===== Export =====
module.exports = { listar, crear, actualizar, eliminar };