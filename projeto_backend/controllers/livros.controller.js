import { db } from "../config/db.js";

// ============================
//  Rotas CRUD
// ============================

export async function criarLivro(req, res) {
    try {
        const {
            titulo,
            autor,
            genero,
            editora,
            ano_publicacao,
            isbn,
            idioma,
            formato,
            caminho_capa,
            classificacao,
            sinopse,
            ativo
        } = req.body;

        if (!titulo || !autor) {
            return res.status(400).json({
                erro: "Título e autor são obrigatórios."
            });
        }

        // Converter "" = null
        const values = [
            titulo,
            autor,
            genero?.trim() || null,
            editora?.trim() || null,
            ano_publicacao?.toString().trim() || null,
            isbn?.trim() || null,
            idioma?.trim() || null,
            formato?.trim() || null,
            caminho_capa?.trim() || null,
            classificacao?.trim() || "Livre",
            sinopse?.trim() || null,
            ativo?.trim() || null
        ];

        // Verificar se ISBN já existe
        const [existe] = await db.execute(
            `SELECT id FROM livros WHERE isbn = ?`,
            [isbn]
        );

        if (existe.length > 0) {
            return res.status(400).json({
                erro: "ISBN já cadastrado."
            });
        }

        await db.execute(
            `INSERT INTO livros 
    (titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, classificacao, sinopse, ativo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            values
        );

        return res.status(201).json({ mensagem: "Livro criado com sucesso!" });

    } catch (err) {
        return res.status(500).json({ erro: err.message });
    }
}

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
        const [rows] = await db.execute(
            "SELECT * FROM livros WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ erro: "Livro não encontrado" });
        }

        return res.status(200).json(rows[0]); 
        
    } catch (err) {
        return res.status(500).json({ erro: err.message });
    }
}

export async function editarLivro(req, res) {
    try {

        const { id } = req.params;

        const {
            titulo,
            autor,
            genero,
            editora,
            ano_publicacao,
            isbn,
            idioma,
            formato,
            caminho_capa,
            classificacao,
            sinopse,
            ativo
        } = req.body;


        if (!titulo || !autor) {
            return res.status(400).json({
                erro: "Título e autor são obrigatórios."
            });
        }

        // Transformar "" = null para evitar erros no MySQL
        const values = [
            titulo,
            autor,
            genero?.trim() || null,
            editora?.trim() || null,
            ano_publicacao?.toString().trim() || null,
            isbn?.trim() || null,
            idioma?.trim() || null,
            formato?.trim() || null,
            caminho_capa?.trim() || null,
            classificacao?.trim() || "Livre",
            sinopse?.trim() || null,       
            ativo?.trim() || null,
            id
        ];
        
        // Verificar se ISBN já existe em outro livro
        const [existe] = await db.execute(
            `SELECT id FROM livros WHERE isbn = ? AND id != ?`,
            [isbn, id]
        );

        if (existe.length > 0) {
            return res.status(400).json({
                erro: "ISBN já está sendo usado por outro livro."
            });
        }

        await db.execute(
            `UPDATE livros SET
                titulo = ?, 
                autor = ?, 
                genero = ?, 
                editora = ?, 
                ano_publicacao = ?, 
                isbn = ?, 
                idioma = ?, 
                formato = ?, 
                caminho_capa = ?, 
                classificacao = ?,   
                sinopse = ?,        
                ativo = ?
            WHERE id = ?`,
            values
        );

        return res.status(200).json({
            mensagem: "Livro atualizado com sucesso!"
        });

    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
}

export async function deletarLivro(req, res) {
    try {
        await db.execute("DELETE FROM livros WHERE id = ?", [req.params.id]);
        res.json({ mensagem: "Livro deletado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};
