import { db } from "../config/db.js";

// ============================
//  Rotas CRUD
// ============================

export async function criarFavorito(req, res) {
    try {

        const { usuario_id, livro_id } = req.body;
        const usuarioIdParsed = parseInt(usuario_id);
        const livroIdParsed = parseInt(livro_id);

        // Valida se vieram os dados
        if (!usuarioIdParsed || !livroIdParsed) {
            return res.status(400).json({
                erro: "usuario_id e livro_id são obrigatórios e devem ser números."
            });
        }

        // Verifica se o usuário existe
        const [user] = await db.execute(
            "SELECT id FROM usuarios WHERE id = ?",
            [usuarioIdParsed]
        );

        if (user.length === 0) {
            return res.status(404).json({ erro: "Usuário não existe." });
        }

        // Verifica se o livro existe
        const [book] = await db.execute(
            "SELECT id FROM livros WHERE id = ?",
            [livroIdParsed]
        );

        if (book.length === 0) {
            return res.status(404).json({ erro: "Livro não existe." });
        }

        // Verifica se já foi favoritado
        const [exists] = await db.execute(
            "SELECT * FROM favoritos WHERE usuario_id = ? AND livro_id = ?",
            [usuarioIdParsed, livroIdParsed]
        );

        if (exists.length > 0) {
            return res.status(400).json({
                erro: "Este livro já está nos favoritos."
            });
        }

        // Inserir favorito
        await db.execute(
            "INSERT INTO favoritos (usuario_id, livro_id) VALUES (?, ?)",
            [usuarioIdParsed, livroIdParsed]
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
        const { usuario_id } = req.query;
        let query = "SELECT * FROM favoritos";
        let params = [];

        if (usuario_id) {
            query += " WHERE usuario_id = ?";
            params = [parseInt(usuario_id)];
        }

        const [rows] = await db.execute(query, params);
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
        const { usuario_id, livro_id } = req.params;
        if (!usuario_id || !livro_id) {
            return res.status(400).json({ erro: "usuario_id e livro_id são obrigatórios no path." });
        }
        // Excluir por usuario_id e livro_id
        const [result] = await db.execute(
            "DELETE FROM favoritos WHERE usuario_id = ? AND livro_id = ?",
            [parseInt(usuario_id), parseInt(livro_id)]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: "Favorito não encontrado" });
        }
        return res.json({ mensagem: "Favorito removido com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};