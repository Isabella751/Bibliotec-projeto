import { db } from "../config/db.js";

// ============================
//  Rotas CRUD
// ============================

export async function criarAvaliacao(req, res) {
    try {
        const { usuario_id, livro_id, nota, comentario } = req.body;
        if (!usuario_id || !livro_id)
            return res.status(400).json({ erro: "Campos obrigatórios" });

        await db.execute(
            "INSERT INTO avaliacoes (usuario_id, livro_id, nota, comentario) VALUES (?, ?, ?, ?)",
            [usuario_id, livro_id, nota, comentario]
        );

        res.json({ mensagem: "Avaliação criada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};


export async function listarAvaliacoes(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM avaliacoes");
        if (!rows || rows.length === 0) {
            return res.status(404).json({ erro: "Nenhuma avaliação encontrada" });
        }
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};