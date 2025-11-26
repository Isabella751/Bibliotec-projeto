import { db } from "../config/db.js";

// ============================
//  Rotas CRUD
// ============================

export async function criarAvaliacao(req, res) {
    try {
        const { usuario_id, livro_id, nota, comentario } = req.body;

        if (!usuario_id || !livro_id || !nota)
            return res.status(400).json({ erro: "Campos obrigatórios" });

        const comentarioFinal = comentario?.trim() || null;

        // Valida se o usuário existe
        const [usuarioExiste] = await db.execute(
            "SELECT id FROM usuarios WHERE id = ?",
            [usuario_id]
        );

        if (usuarioExiste.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }

        //  Valida se o livro existe
        const [livroExiste] = await db.execute(
            "SELECT id FROM livros WHERE id = ?",
            [livro_id]
        );

        if (livroExiste.length === 0) {
            return res.status(404).json({ erro: "Livro não encontrado." });
        }

        //  Verifica se o usuário já avaliou ESSE livro
        const [avaliacaoExiste] = await db.execute(
            `SELECT id FROM avaliacoes WHERE usuario_id = ? AND livro_id = ?`,
            [usuario_id, livro_id]
        );

        if (avaliacaoExiste.length > 0) {
            return res.status(400).json({
                erro: "Você já avaliou este livro."
            });
        }

        await db.execute(
            "INSERT INTO avaliacoes (usuario_id, livro_id, nota, comentario) VALUES (?, ?, ?, ?)",
            [usuario_id, livro_id, nota, comentarioFinal]
        );

        res.json({ mensagem: "Avaliação criada com sucesso!" });

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}


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

export async function obterAvaliacao(req, res) {
    try {
        const { id } = req.params;

        const [rows] = await db.execute(
            "SELECT * FROM avaliacoes WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ erro: "Avaliação não encontrada" });
        }

        res.json(rows[0]);

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

export async function editarAvaliacao(req, res) {
    try {
        const { id } = req.params;
        const { nota, comentario } = req.body;
        if (!nota)
            return res.status(400).json({ erro: "Campo 'nota' é obrigatório" });

        const comentarioFinal = comentario?.trim() || null;

        // Verifica se existe
        const [existe] = await db.execute(
            "SELECT id FROM avaliacoes WHERE id = ?",
            [id]
        );
        if (existe.length === 0) {
            return res.status(404).json({ erro: "Avaliação não encontrada." });
        }
        await db.execute(
            "UPDATE avaliacoes SET nota = ?, comentario = ? WHERE id = ?",
            [nota, comentarioFinal, id]
        );
        res.json({ mensagem: "Avaliação atualizada com sucesso!" });

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function excluirAvaliacao(req, res) {
    try {
        const { id } = req.params;

        // Verifica se existe
        const [existe] = await db.execute(
            "SELECT id FROM avaliacoes WHERE id = ?",
            [id]
        );

        if (existe.length === 0) {
            return res.status(404).json({ erro: "Avaliação não encontrada." });
        }

        await db.execute("DELETE FROM avaliacoes WHERE id = ?", [id]);

        res.json({ mensagem: "Avaliação deletada com sucesso!" });

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}
