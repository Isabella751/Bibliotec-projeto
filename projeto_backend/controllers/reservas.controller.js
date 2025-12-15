import { db } from "../config/db.js";

// ===============================================
// FUNÇÕES AUXILIARES PARA DATAS (Nativas do JS)
// ===============================================

/**
 * Formata um objeto Date para o formato YYYY-MM-DD HH:mm:ss (MySQL DATETIME).
 * @param {Date} dateObj
 * @returns {string}
 */
function formatarParaDateTime(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Formata um objeto Date para o formato YYYY-MM-DD (MySQL DATE).
 * @param {Date} dateObj
 * @returns {string}
 */
function formatarParaDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Calcula a data de devolução (14 dias após a retirada) e formata para YYYY-MM-DD.
 * @param {Date} dataRetiradaObj 
 * @returns {string}
 */
function calcularDataDevolucao(dataRetiradaObj) {
    const dataDevolucao = new Date(dataRetiradaObj);
    // Adiciona 14 dias
    dataDevolucao.setDate(dataDevolucao.getDate() + 14); 
    return formatarParaDate(dataDevolucao);
}

// ============================
// Rotas CRUD
// ============================

export async function criarReserva(req, res) {
    try {
        const { usuario_id, livro_id, data_retirada, email_confirma } = req.body;
        
        // LOG DE DEPURAÇÃO PARA VERIFICAR QUAL ID ESTÁ CHEGANDO
        console.log(`[DEBUG] Tentativa de Reserva - ID Recebido: ${usuario_id}`);

        if (!usuario_id || !livro_id || !data_retirada || !email_confirma) {
            return res.status(400).json({ erro: "Dados incompletos: ID do usuário/livro, Data de Retirada e Email são obrigatórios." });
        }

        // 1. Validação de Usuário (Busca Dupla: 'usuarios' e 'admins')
        // Tenta buscar primeiro na tabela usuarios
        let [user] = await db.query("SELECT id, email FROM usuarios WHERE id = ?", [usuario_id]);

        // Se não encontrou em usuarios, tenta buscar em admins
        if (user.length === 0) {
            [user] = await db.query("SELECT id, email FROM admins WHERE id = ?", [usuario_id]);
        }
        
        if (user.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado. O ID do usuário logado não existe nas tabelas 'usuarios' ou 'admins'." });
        }

        // 2. Validação do Email
        if (user[0].email.toLowerCase() !== email_confirma.toLowerCase()) {
            return res.status(400).json({ erro: "Confirmação de e-mail incorreta." });
        }

        // 3. Validação do Livro e disponibilidade (Checa se está ativo = 1)
        const [livro] = await db.query("SELECT id, ativo FROM livros WHERE id = ?", [livro_id]);
        if (livro.length === 0) {
            return res.status(404).json({ erro: `Livro ID ${livro_id} não encontrado` });
        }
        if (livro[0].ativo == 0) {
             return res.status(400).json({ erro: `O livro já está indisponível para reserva.` });
        }


        // 4. Checa se o livro já tem uma reserva ATIVA
        // USANDO O CAMPO 'status_reserva'
        const [reservaAtiva] = await db.query(
            `SELECT 
                r.id 
             FROM reservas r
             JOIN reserva_itens ri ON ri.reserva_id = r.id
             WHERE ri.livro_id = ?
               AND r.status_reserva IN ('Reservado', 'Emprestado', 'Atrasado')`,
            [livro_id]
        );

        if (reservaAtiva.length > 0) {
            return res.status(400).json({ erro: `O livro ID ${livro_id} já possui uma reserva ativa ou está emprestado.` });
        }
        
        // 5. Cálculo das Datas
        const dataRetiradaObj = new Date(data_retirada);
        const dataRetiradaFormatada = formatarParaDate(dataRetiradaObj); 
        const dataDevolucaoPrevista = calcularDataDevolucao(dataRetiradaObj); 
        const dataReserva = formatarParaDate(new Date()); // Usando DATE para corresponder à sua coluna

        // 6. Cria a Reserva (Status inicial: Reservado)
        // USANDO OS CAMPOS 'data_reserva' e 'data_retirada_prevista' e 'status_reserva'
        const [resInsert] = await db.query(
            `INSERT INTO reservas (usuario_id, data_reserva, data_retirada_prevista, status_reserva)
             VALUES (?, ?, ?, 'Reservado')`,
            [usuario_id, dataReserva, dataRetiradaFormatada]
        );

        const reserva_id = resInsert.insertId;

        // 7. Insere o item da reserva com a data de devolução prevista
        await db.query(
            `INSERT INTO reserva_itens (reserva_id, livro_id, data_prevista)
             VALUES (?, ?, ?)`,
            [reserva_id, livro_id, dataDevolucaoPrevista]
        );
        
        // 8. ATUALIZAÇÃO CHAVE: MARCA O LIVRO COMO INDISPONÍVEL
        await db.query(
            `UPDATE livros SET ativo = 0 WHERE id = ?`,
            [livro_id]
        );

        res.status(201).json({
            msg: "Livro reservado com sucesso!",
            data_devolucao_prevista: dataDevolucaoPrevista,
            reserva_id
        });

    } catch (erro) {
        console.error("Erro ao criar reserva:", erro);
        res.status(500).json({ erro: erro.message });
    }
}


export async function listarReservas(req, res) {
    try {
      const [rows] = await db.query(`
        SELECT
          r.id AS reserva_id,
          r.usuario_id,
          r.data_reserva,
          r.data_devolucao_real,
          r.status_reserva,
          ri.livro_id
        FROM reservas r
        LEFT JOIN reserva_itens ri ON ri.reserva_id = r.id
        ORDER BY r.id DESC
      `);
      
      res.status(200).json(rows);
      
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
}

export async function obterReserva(req, res) {
    try {
      const { id } = req.params;
      
      const [reserva] = await db.query("SELECT * FROM reservas WHERE id = ?", [id]);
      if (reserva.length === 0)
        return res.status(404).json({ erro: "Reserva não encontrada" });
      
      const [itens] = await db.query(
        "SELECT * FROM reserva_itens WHERE reserva_id = ?",
        [id]
      );
      
      res.status(200).json({
        ...reserva[0],
        itens
      });
      
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
}

export async function excluirReserva(req, res) {
    try {
      const { id } = req.params;
      
      const [reserva] = await db.query("SELECT id FROM reservas WHERE id = ?", [id]);
      if (reserva.length === 0)
        return res.status(404).json({ erro: "Reserva não encontrada" });
      
      // OPTIONAL: Adicionar lógica para reverter 'ativo=0' para 'ativo=1' no livro aqui
      
      await db.query("DELETE FROM reserva_itens WHERE reserva_id = ?", [id]);
      await db.query("DELETE FROM reservas WHERE id = ?", [id]);
      
      res.json({ msg: "Reserva removida com sucesso" });
      
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
}

export async function devolverLivro(req, res) {
    const { emprestimo_id, livro_id } = req.body;
    
    try {
      // ESTA FUNÇÃO PARECE SER USADA PARA EMPRÉSTIMOS. 
      // Se não for usada, pode ignorar o erro.
      
      // 1. Marca o livro como devolvido
      await db.query(
        "UPDATE emprestimo_itens SET devolvido = 1 WHERE emprestimo_id = ? AND livro_id = ?",
        [emprestimo_id, livro_id]
      );
      
      // 2. Verifica se todos já foram devolvidos
      await verificarDevolucaoCompleta(emprestimo_id);
      
      // 3. ATUALIZAÇÃO CHAVE: Marca o livro como DISPONÍVEL (ativo = 1)
      await db.query(
          `UPDATE livros SET ativo = 1 WHERE id = ?`,
          [livro_id]
      );
      
      res.json({ sucesso: true, mensagem: "Livro devolvido e disponibilizado!" });
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
}

async function verificarDevolucaoCompleta(emprestimo_id) {
    // Verifica se ainda existe algum item NÃO devolvido
    const [naoDevolvidos] = await db.query(
      "SELECT COUNT(*) AS total FROM emprestimo_itens WHERE emprestimo_id = ? AND devolvido = 0",
      [emprestimo_id]
    );
    
    // Se ainda há algum livro não devolvido → sai
    if (naoDevolvidos[0].total > 0) return;
    
    // Se chegou aqui → TODOS foram devolvidos
    await db.query(
      "UPDATE emprestimos SET data_devolucao = CURDATE() WHERE id = ?",
      [emprestimo_id]
    );
}

// Função para listar os livros que um usuário reservou
export async function buscarReservasUsuario(req, res) {
    try {
        const { id } = req.params; // Pega o ID do usuário da URL

        // Faz o JOIN para pegar os dados da reserva + nome do livro e capa
        const [reservas] = await db.execute(
            `SELECT 
                r.id AS reserva_id,
                r.data_retirada,
                r.data_devolucao_prevista,
                r.status,
                l.titulo AS titulo_livro,
                l.caminho_capa
             FROM reservas r
             JOIN livros l ON r.livro_id = l.id
             WHERE r.usuario_id = ?
             ORDER BY r.data_retirada DESC`,
            [id]
        );

        return res.status(200).json(reservas);

    } catch (err) {
        console.error("Erro ao buscar reservas:", err);
        return res.status(500).json({ erro: "Erro ao buscar suas reservas." });
    }
}