// ===== Imports =====
const pool = require("../config/db");

// ===== Listar transacciones =====
// Filtros opcionales por query: mes=YYYY-MM, tipo=ingreso|gasto, categoria_id
const listar = async (req, res) => {
    try {
        const { mes, tipo, categoria_id } = req.query;
        const filtros = ["usuario_id = $1"];
        const valores = [req.usuario.id];

        if (tipo) {
            valores.push(tipo);
            filtros.push(`tipo = $${valores.length}`);
        }

        if (categoria_id) {
            valores.push(categoria_id);
            filtros.push(`categoria_id = $${valores.length}`);
        }

        if (mes) {
            valores.push(mes);
            filtros.push(`to_char(fecha, 'YYYY-MM') = $${valores.length}`);
        }

        const where = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";
        const result = await pool.query(
            `SELECT id, categoria_id, tipo, monto, fecha, nota
             FROM transacciones
             ${where}
             ORDER BY fecha DESC, id DESC`,
            valores
        );

        console.log('Transacciones obtenidas:', result.rows); // Log para depuración

        return res.json({ transacciones: result.rows });
    } catch (error) {
        console.error('Error al listar transacciones:', error); // Log para errores
        return res.status(500).json({ error: error.message });
    }
};

// ===== Crear transacción =====
const crear = async (req, res) => {
	try {
		const { categoria_id, tipo, monto, fecha, nota } = req.body;
		if (!categoria_id || !tipo || monto === undefined || !fecha) {
			return res.status(400).json({ error: "Faltan datos" });
		}

		const result = await pool.query(
			`INSERT INTO transacciones (usuario_id, categoria_id, tipo, monto, fecha, nota)
			 VALUES ($1, $2, $3, $4, $5, $6)
			 RETURNING id, categoria_id, tipo, monto, fecha, nota`,
			[req.usuario.id, categoria_id, tipo, monto, fecha, nota || null]
		);

		return res.status(201).json({ transaccion: result.rows[0] });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

// ===== Actualizar transacción =====
const actualizar = async (req, res) => {
	try {
		const { id } = req.params;
		const { categoria_id, tipo, monto, fecha, nota } = req.body;
		if (!categoria_id || !tipo || monto === undefined || !fecha) {
			return res.status(400).json({ error: "Faltan datos" });
		}

		const result = await pool.query(
			`UPDATE transacciones
			 SET categoria_id = $1, tipo = $2, monto = $3, fecha = $4, nota = $5
			 WHERE id = $6 AND usuario_id = $7
			 RETURNING id, categoria_id, tipo, monto, fecha, nota`,
			[categoria_id, tipo, monto, fecha, nota || null, id, req.usuario.id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Transacción no encontrada" });
		}

		return res.json({ transaccion: result.rows[0] });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

// ===== Eliminar transacción =====
const eliminar = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"DELETE FROM transacciones WHERE id = $1 AND usuario_id = $2 RETURNING id",
			[id, req.usuario.id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Transacción no encontrada" });
		}

		return res.json({ ok: true });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

// ===== Export =====
module.exports = { listar, crear, actualizar, eliminar };
