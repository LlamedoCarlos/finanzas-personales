// ===== Imports =====
const jwt = require("jsonwebtoken");

// ===== Middleware de autenticación =====
const autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Validar que exista el header Authorization
  if (!authHeader) {
    return res.status(401).json({ error: "Falta token" });
  }
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  console.log('Authorization Header:', authHeader);
  const parts = authHeader.split(" ");
  // Validar formato "Bearer <token>"
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Formato de token inválido" });
  }
  const token = parts[1];
  try {
    // Verificar token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

// ===== Export =====
module.exports = autenticar;