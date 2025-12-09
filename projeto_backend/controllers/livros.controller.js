import { db } from "../config/db.js";

function emptyToNull(value) {
    return value === "" || value == null ? null : value;
}

function normalizeAtivo(value) {
    return (value === true || value === "1" || value === 1) ? 1 : 0;
}

function buildCapaUrl(caminho) {
    if (!caminho) return null;

    let c = String(caminho).trim().replace(/^\/+/, ""); // remove barras no começo

    // Se já for URL completa, retorna como está
    if (/^https?:\/\//i.test(c)) return c;

    // monta URL válida do servidor
    return `http://localhost:3000/${c}`;
}

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

        // validar campos obrigatórios
        if (!titulo || !autor || !genero || !editora || !ano_publicacao || !isbn || !idioma || !formato || !caminho_capa || !classificacao || !sinopse) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
        }

        const [existe] = await db.execute("SELECT id FROM livros WHERE isbn = ?", [isbn]);
        if (existe.length > 0) {
            return res.status(400).json({ erro: "ISBN já cadastrado." });
        }

        const values = [
            titulo,
            autor,
            genero,
            editora || null,
            ano_publicacao || null,
            isbn,
            idioma || "Português",
            formato || "Físico",
            caminho_capa, // EX: "book_images/don_casmurro.png"
            classificacao || "Livre",
            sinopse || null,
            normalizeAtivo(ativo)
        ];

        const [result] = await db.execute(
            "INSERT INTO livros (titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, classificacao, sinopse, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            values
        );

        return res.status(201).json({ mensagem: "Livro criado!", id: result.insertId });

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

export async function listarLivros(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM livros");

        const formatados = rows.map(livro => ({
        ...livro,
        caminho_capa: buildCapaUrl(livro.caminho_capa)
        }));

        return res.json(formatados);

    } catch (err) {
        return res.status(500).json({ erro: err.message });
    }
}

export async function obterLivro(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM livros WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ erro: "Livro não encontrado" });
        const livro = { ...rows[0] };
        livro.caminho_capa = buildCapaUrl(livro.caminho_capa);
        return res.json(livro);
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

        // validar campos obrigatórios
        if (!titulo || !autor || !genero || !editora || !ano_publicacao || !isbn || !idioma || !formato || !caminho_capa || !classificacao || !sinopse) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
        }

        const isbnClean = String(isbn).trim();
        // Verificar ISBN único em outro registro
        const [existe] = await db.execute("SELECT id FROM livros WHERE isbn = ? AND id != ?", [isbnClean, id]);
        if (existe.length > 0) return res.status(400).json({ erro: "ISBN já está sendo usado por outro livro." });

        const values = [
            String(titulo).trim(),
            String(autor).trim(),
            String(genero).trim(),
            String(editora).trim(),
            Number(ano_publicacao),
            isbnClean,
            String(idioma).trim(),
            String(formato).trim(),
            String(caminho_capa).trim(),
            String(classificacao).trim(),
            String(sinopse).trim(),
            normalizeAtivo(ativo),
            id
        ];

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

        return res.status(200).json({ mensagem: "Livro atualizado com sucesso!" });
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
}
