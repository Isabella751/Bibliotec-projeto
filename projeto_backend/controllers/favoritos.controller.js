import { db } from "../config/db.js";

// ============================
//  Rotas CRUD
// ============================

export async function criarFavorito(req, res) {
    try {

        const { usuario_id, livro_id } = req.body;

        // Valida se vieram os dados
        if (!usuario_id || !livro_id) {
            return res.status(400).json({
                erro: "usuario_id e livro_id são obrigatórios."
            });
        }

        // Verifica se o usuário existe
        const [user] = await db.execute(
            "SELECT id FROM usuarios WHERE id = ?",
            [usuario_id]
        );

        if (user.length === 0) {
            return res.status(404).json({ erro: "Usuário não existe." });
        }

        // Verifica se o livro existe
        const [book] = await db.execute(
            "SELECT id FROM livros WHERE id = ?",
            [livro_id]
        );

        if (book.length === 0) {
            return res.status(404).json({ erro: "Livro não existe." });
        }

        // Verifica se já foi favoritado
        const [exists] = await db.execute(
            "SELECT * FROM favoritos WHERE usuario_id = ? AND livro_id = ?",
            [usuario_id, livro_id]
        );

        if (exists.length > 0) {
            return res.status(400).json({
                erro: "Este livro já está nos favoritos."
            });
        }

        // Inserir favorito
        await db.execute(
            "INSERT INTO favoritos (usuario_id, livro_id) VALUES (?, ?)",
            [usuario_id, livro_id]
        );

        return res.status(201).json({
            mensagem: "Livro favoritado com sucesso!"
        });

    } catch (err) {
        return res.status(500).json({ erro: err.message });
    }
};


export async function listarFavoritos(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM favoritos");
        if (!rows || rows.length === 0) {
            return res.status(404).json({ erro: "Nenhum favorito encontrado" });
        }
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function excluirFavorito(req, res) {
    try {
        await db.execute("DELETE FROM favoritos WHERE id = ?", [req.params.id]);
        res.json({ mensagem: "Favorito deletado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};