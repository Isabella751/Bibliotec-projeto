import { db } from "../config/db.js";

function emptyToNull(value) {
    return value === "" || value == null ? null : value;
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

        if (!titulo || !autor || !genero || !editora || !ano_publicacao || !isbn || !idioma || !formato || !caminho_capa || !classificacao || !sinopse) {
            return res.status(400).json({ erro: "campos não prenchidos" });
        }

        const isbnClean = emptyToNull(isbn?.toString().trim());
        // Verificar ISBN apenas se informado
        if (isbnClean) {
            const [existe] = await db.execute("SELECT id FROM livros WHERE isbn = ?", [isbnClean]);
            if (existe.length > 0) {
                return res.status(400).json({ erro: "ISBN já cadastrado." });
            }
        }

        await db.execute(
            "INSERT INTO livros (titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, classificacao, sinopse, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [titulo, autor, genero, editora, ano_publicacao, isbnClean, idioma, formato, caminho_capa, classificacao, sinopse, ativo]
        );
        res.status(201).json({ mensagem: "Livro criado com sucesso!"});
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

function buildCapaUrl(caminho) {
    if (!caminho) return null;
    const c = String(caminho).trim();
    if (/^https?:\/\//i.test(c)) return c;
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    if (c.startsWith("/")) return baseUrl + c;
    // assume filename armazenado em public/book_images/
    return `${baseUrl}/book_images/${c.replace(/^\/+/, "")}`;
}

export async function listarLivros(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM livros");
        const mapped = rows.map(r => {
            const novo = { ...r };
            novo.caminho_capa = buildCapaUrl(novo.caminho_capa);
            return novo;
        });
        res.json(mapped);
    } catch (err) {
        res.status(500).json({ erro: err.message });
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
            sinopse,
            ativo
        } = req.body;

        if (!titulo || !autor || !genero || !editora || !ano_publicacao || !isbn || !idioma || !formato || !caminho_capa || !classificacao || !sinopse) {
            return res.status(400).json({ erro: "campos não prenchidos" });
        }

        const isbnClean = emptyToNull(isbn?.toString().trim());
        if (isbnClean) {
            const [existe] = await db.execute("SELECT id FROM livros WHERE isbn = ? AND id != ?", [isbnClean, id]);
            if (existe.length > 0) return res.status(400).json({ erro: "ISBN já está sendo usado por outro livro." });
        }

        const values = [
            titulo.trim(),
            autor.trim(),
            emptyToNull(genero?.toString().trim()),
            emptyToNull(editora?.toString().trim()),
            emptyToNull(ano_publicacao?.toString().trim()),
            isbnClean,
            emptyToNull(idioma?.toString().trim()),
            emptyToNull(formato?.toString().trim()),
            emptyToNull(caminho_capa?.toString().trim()),
            emptyToNull(sinopse?.toString().trim()),
            emptyToNull(ativo?.toString().trim()),
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
