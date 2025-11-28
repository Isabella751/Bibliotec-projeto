import { db } from "../config/db.js";
// ============================
//  Rotas CRUD
// ============================

export async function adicionarItem (req, res) {
    try {
        const { reserva_id, livro_id, data_prevista, data_devolvido} = req.body;
        if (!reserva_id || !livro_id || !data_prevista) 
            return res.status(400).json({ error: "Campos obrigatórios" });

        const [reservaRows] = await db.execute("SELECT * FROM reservas WHERE id = ?", [reserva_id]);
        if (reservaRows.length === 0) 
            return res.status(404).json({ error: "Reserva não encontrada" });

        const data_devolvidoEdit = data_devolvido === undefined || data_devolvido === "" ? null : data_devolvido;

        await db.execute(
            "INSERT INTO reserva_itens (reserva_id, livro_id, data_prevista, data_devolvido) VALUES (?, ?, ?, ?)",
            [reserva_id, livro_id, data_prevista, data_devolvidoEdit]
        );
        res.status(201).json({ message: "Item adicionado à reserva com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export async function listarItensReserva (req, res) {
    try {
        const { reserva_id } = req.params;
        const [rows] = await db.execute("SELECT * FROM reserva_itens WHERE reserva_id = ?", [reserva_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export async function removerItem (req, res) {
    try {
        const { id } = req.params;
        const [rows] = await db.execute("SELECT * FROM reserva_itens WHERE id = ?", [id]);
        if (rows.length === 0)
            return res.status(404).json({ error: "Item da reserva não encontrado" });
        await db.execute("DELETE FROM reserva_itens WHERE id = ?", [id]);
        res.json({ message: "Item da reserva removido com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};