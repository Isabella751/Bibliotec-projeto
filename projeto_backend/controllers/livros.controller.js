import { db } from "../config/db.js";

// ============================
//  Rotas CRUD
// ============================

export async function criarLivro(req, res) {
    try {
        const {
            titulo, autor, genero, editora, ano_publicacao,
            isbn, idioma, formato, caminho_capa, classificacao,
            sinopse, ativo, destaque
        } = req.body;

        // 1. Validação Obrigatória (Igual ao criarUsuario)
        if (!titulo || !autor) {
            return res.status(400).json({ erro: "Título e autor são obrigatórios." });
        }

        // 2. Validação e Limpeza do ISBN (Se foi enviado)
        if (isbn && isbn.trim() !== "") {
            const isbnLimpo = isbn.trim();
            
            // Verifica se já existe no banco
            const [existe] = await db.execute(
                `SELECT id FROM livros WHERE isbn = ?`,
                [isbnLimpo]
            );

            if (existe.length > 0) {
                return res.status(400).json({ erro: "ISBN já cadastrado no sistema." });
            }
        }

        // 3. Preparação dos Dados (Correção do erro .trim)
        const values = [
            titulo.trim(),
            autor.trim(),
            genero?.trim() || null,
            editora?.trim() || null,
            
            // Ano vira número inteiro
            ano_publicacao ? parseInt(ano_publicacao) : null, 
            
            isbn?.trim() || null,
            idioma?.trim() || null,
            formato?.trim() || null,
            caminho_capa?.trim() || null,
            classificacao?.trim() || "Livre",
            sinopse?.trim() || null,
            
            // CORREÇÃO: Transformar Booleanos (true/false) em Inteiros (1/0)
            // Isso evita o erro "ativo.trim is not a function"
            ativo ? 1 : 0,      
            destaque ? 1 : 0    
        ];

        // 4. Inserção no Banco (Adicionado campo 'destaque')
        await db.execute(
    `INSERT INTO livros 
    (titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, classificacao, sinopse, ativo, destaque, visualizacoes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`, 
    values
);

        return res.status(201).json({ mensagem: "Livro cadastrado com sucesso!" });

    } catch (err) {
        console.error("Erro ao criar livro:", err);
        
        // Tratamento de erro genérico
        return res.status(500).json({ erro: "Erro interno no servidor: " + err.message });
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

export async function registrarVisualizacao(req, res) {
    try {
        const { id } = req.params;

        await db.execute(
            `UPDATE livros 
             SET visualizacoes = visualizacoes + 1,
                 ultima_visualizacao = NOW()
             WHERE id = ?`,
            [id]
        );

        return res.status(200).json({ mensagem: "Visualização registrada" });

    } catch (err) {
        return res.status(500).json({ erro: err.message });
    }
}

// livros.controller.js (Aproximadamente Linha 245)

export async function obterDestaques(req, res) {
    try {
        const limite = req.query.limite || 24; // Quantidade máxima de destaques a exibir

        // -----------------------------------------------------
        // MODIFICAÇÃO CHAVE AQUI: Adicionamos a condição visualizacoes >= 10
        // -----------------------------------------------------
        const [rows] = await db.execute(
            `SELECT * FROM livros 
             WHERE (ativo = 1 OR ativo IS NULL) 
             AND visualizacoes >= 10 
             ORDER BY visualizacoes DESC, ultima_visualizacao DESC
             LIMIT ?`,
            [parseInt(limite)]
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

export async function buscarLivros(req, res) {
    try {
        const { q } = req.query;

        // Debug: Vai aparecer no terminal do VS Code quando você pesquisar
        console.log("Tentando buscar por:", q);

        if (!q) return res.json([]);

        const termo = `%${q.trim()}%`;

        const [rows] = await db.execute(
            `SELECT * FROM livros 
             WHERE (ativo = 1 OR ativo IS NULL)
             AND (titulo LIKE ? OR autor LIKE ? OR genero LIKE ?)`,
            [termo, termo, termo]
        );

        console.log("Livros encontrados:", rows.length); // Debug
        res.json(rows);

    } catch (err) {
        console.error("Erro na busca:", err);
        res.status(500).json({ erro: err.message });
    }
}
