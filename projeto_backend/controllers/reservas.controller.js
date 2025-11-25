import { db } from "../config/db.js";

// ============================
//  Rotas CRUD
// ============================

export async function criarReserva(req, res) {
    try {
        const { usuario_id, livro_id, data_devolucao } = req.body;
        if (!usuario_id || !livro_id || !data_devolucao)
            return res.status(400).json({ erro: "Campos obrigatórios" });

        await db.execute(
            "INSERT INTO reservas (usuario_id, livro_id, data_devolucao) VALUES (?, ?, ?, ?)",
            [usuario_id, livro_id, data_devolucao]
        );

        res.json({ mensagem: "Reserva criada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};


export async function listarReservas(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM reservas");
        if (!rows || rows.length === 0) {
            return res.status(404).json({ erro: "Nenhuma reserva encontrada" });
        }
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function excluirReserva(req, res) {
    try {
        await db.execute("DELETE FROM reservas WHERE id = ?", [req.params.id]);
        res.json({ mensagem: "Reserva deletada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};