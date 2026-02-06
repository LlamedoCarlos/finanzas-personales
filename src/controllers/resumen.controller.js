// ===== Imports =====
const pool = require("../config/db");

// ===== Resumen mensual =====
// Query param: mes=YYYY-MM
const mensual = async (req, res) => {
	try {
		const { mes } = req.query;
		if (!mes) {
			return res.status(400).json({ error: "Falta el parámetro mes" });
		}

		const result = await pool.query(
			`SELECT c.id AS categoria_id, c.nombre, c.tipo,
							SUM(t.monto) AS total
			 FROM transacciones t
			 JOIN categorias c ON c.id = t.categoria_id
			 WHERE t.usuario_id = $1
				 AND to_char(t.fecha, 'YYYY-MM') = $2
			 GROUP BY c.id, c.nombre, c.tipo
			 ORDER BY c.tipo, total DESC`,
			[req.usuario.id, mes]
		);

		return res.json({ resumen: result.rows });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

// ===== Export =====
module.exports = { mensual };
