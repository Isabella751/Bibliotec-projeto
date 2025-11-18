import { db } from "../config/db.js";

// ============================
//  Rotas CRUD
// ============================

export async function criarLivro(req, res) {
    try {
        const { titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, ativo } = req.body;
        if (!titulo || !autor || !genero || !editora || !ano_publicacao || !isbn || !idioma || !formato || !caminho_capa || !sinopse || !ativo)
            return res.status(400).json({ erro: "Campos obrigatórios" });

        await db.execute(
            "INSERT INTO livros (titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, ativo]
        );

        res.json(201,
            { mensagem: "Livro criado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function listarLivros(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM livros");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function obterLivro(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM livros WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0)
            return res.status(404).json({ erro: "Livro não encontrado" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function editarLivro(req, res) {
    try {
        const { titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, ativo } = req.body;
        await db.execute(
            "UPDATE livros SET titulo = ?, autor = ?, genero = ?, editora = ?, ano_publicacao = ?, isbn = ?, idioma = ?, formato = ?, caminho_capa = ?, sinopse = ?, ativo = ? WHERE id = ?",
            [titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, ativo, req.params.id]
        );
        res.json({ mensagem: "Livro atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function deletarLivro(req, res) {
    try {
        await db.execute("DELETE FROM livros WHERE id = ?", [req.params.id]);
        res.json({ mensagem: "Livro deletado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};


// export async function obterUsuario (req, res) {
//     try {
//         const [rows] = await db.execute("SELECT * FROM usuarios WHERE id = ?", [
//             req.params.id,
//         ]);
//         if (rows.length === 0)
//             return res.status(404).json({ erro: "Usuário não encontrado" });
//         res.json(rows[0]);
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function atualizarUsuario (req, res) {
//     try {
//         const { nome, email, senha } = req.body;
//         await db.execute(
//             "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?",
//             [nome, email, senha, req.params.id]
//         );
//         res.json({ mensagem: "Usuário atualizado com sucesso!" });
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };

// export async function deletarUsuario (req, res) {
//     try {
//         await db.execute("DELETE FROM usuarios WHERE id = ?", [req.params.id]);
//         res.json({ mensagem: "Usuário deletado com sucesso!" });
//     } catch (err) {
//         res.status(500).json({ erro: err.message });
//     }
// };