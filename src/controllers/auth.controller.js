// ===== Imports =====
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// ===== Registro de usuario =====
const registrar = async (req, res) => {
  try {
    const { nombre, email, password, passwordConfirm } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !password || !passwordConfirm) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: "Las contraseñas no coinciden" });
    }

    // Verificar si el email ya existe
    const existe = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email],
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre, email",

      [nombre, email, passwordHash],
    );

    return res.status(201).json({ usuario: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ===== Login de usuario =====
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    // Buscar usuario por email
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const usuario = result.rows[0];

    // Comparar contraseña
    const ok = await bcrypt.compare(password, usuario.password_hash);

    if (!ok) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ===== Export =====
module.exports = { registrar, login };
