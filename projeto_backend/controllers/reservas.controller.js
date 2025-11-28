import { db } from "../config/db.js";
// ============================
//  Rotas CRUD
// ============================

export async function listarReservas (req, res) {
    try {
        const [rows] = await db.execute(`
            SELECT e.*, u.nome AS usuario
            FROM emprestimos e
            JOIN usuarios u ON u.id = e.usuario_id
        `); 
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export async function obterReservas (req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM reservas WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0)
            return res.status(404).json({ error: "Reserva não encontrada" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export async function criarReservas (req, res) {
    try {
        const { usuario_id, data_devolucao, status_reserva} = req.body;
        if (!usuario_id || !data_devolucao) 
            return res.status(400).json({ error: "Campos obrigatórios" });
        
        const Edit_status = status_reserva === undefined || status_reserva === "" ? "ativa" : status_reserva;

        const [usuarioRows] = await db.execute("SELECT * FROM usuarios WHERE id = ?", [usuario_id]);
        if (usuarioRows.length === 0) 
            return res.status(404).json({ error: "Usuário não encontrado" });


        await db.execute(
            "INSERT INTO reservas (usuario_id, data_devolucao, status_reserva) VALUES (?, ?, ?)",
            [usuario_id, data_devolucao, Edit_status]
        );

        res.status(201).json({ message: "Reserva criada com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export async function deletarReservas (req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM reservas WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0)
            return res.status(404).json({ error: "Reserva não encontrada" });
        await db.execute("DELETE FROM reservas WHERE id = ?", [req.params.id]);
        res.json({ message: "Reserva deletada com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};