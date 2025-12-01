import { db } from "../config/db.js";

// ============================
//  Rotas CRUD
// ============================

export async function criarReserva(req, res) {
  try {
    const { usuario_id, itens } = req.body;

    if (!usuario_id || !itens || itens.length === 0)
      return res.status(400).json({ erro: "Dados incompletos para criar reserva" });

    // Verifica usuário
    const [user] = await db.query("SELECT id FROM usuarios WHERE id = ?", [usuario_id]);
    if (user.length === 0)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    // Verifica livros e se já estão reservados
    for (const item of itens) {

      // Verifica se existe
      const [livro] = await db.query("SELECT id FROM livros WHERE id = ?", [item.livro_id]);
      if (livro.length === 0)
        return res.status(404).json({ erro: `Livro ID ${item.livro_id} não encontrado` });

      // Verifica reserva ativa
      const [existe] = await db.query(
        `SELECT r.id FROM reservas r
         JOIN reserva_itens ri ON ri.reserva_id = r.id
         WHERE r.usuario_id = ?
           AND ri.livro_id = ?
           AND r.status_emprestimo IN ('Emprestado', 'Atrasado')`,
        [usuario_id, item.livro_id]
      );

      if (existe.length > 0)
        return res.status(400).json({ erro: `Você já possui uma reserva ativa do livro ID ${item.livro_id}` });
    }

    // Datas
    const dataEmprestimo = new Date().toISOString().split('T')[0];
    const dataDevolucao = new Date();
    dataDevolucao.setDate(dataDevolucao.getDate() + 15); // +15 dias
    const dataDevolucaoStr = dataDevolucao.toISOString().split('T')[0];

    // Cria reserva
    const [resInsert] = await db.query(
      `INSERT INTO reservas (usuario_id, data_emprestimo, data_devolução, status_emprestimo)
       VALUES (?, ?, ?, 'Emprestado')`,
      [usuario_id, dataEmprestimo, dataDevolucaoStr]
    );

    const reserva_id = resInsert.insertId;

    // Insere itens + data_prevista
    for (const item of itens) {
      await db.query(
        `INSERT INTO reserva_itens (reserva_id, livro_id, data_prevista)
         VALUES (?, ?, ?)`,
        [reserva_id, item.livro_id, dataDevolucaoStr]
      );
    }

    res.status(201).json({
      msg: "Reserva criada com sucesso",
      reserva_id
    });

  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

export async function listarReservas(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT
        r.id AS reserva_id,
        r.usuario_id,
        r.data_emprestimo,
        r.data_devolução,
        r.status_emprestimo,
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

    await db.query("DELETE FROM reserva_itens WHERE reserva_id = ?", [id]);
    await db.query("DELETE FROM reservas WHERE id = ?", [id]);

    res.json({ msg: "Reserva removida com sucesso" });

  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

export async function devolverLivro(req, res) {
  const { reserva_id, livro_id } = req.body;

  try {
    // 1. Marca o livro como devolvido
    await db.query(
      "UPDATE reserva_itens SET data_devolvido = CURDATE() WHERE reserva_id = ? AND livro_id = ?",
      [reserva_id, livro_id]
    );

    // 2. Verifica se todos já foram devolvidos
    await verificarDevolucaoCompleta(reserva_id);

    res.json({ sucesso: true, mensagem: "Livro devolvido!" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function verificarDevolucaoCompleta(reserva_id) {
  // Verifica se ainda existe algum item NÃO devolvido
  const [naoDevolvidos] = await db.query(
    "SELECT COUNT(*) AS total FROM reserva_itens WHERE reserva_id = ? AND data_devolvido IS NULL",
    [reserva_id]
  );

  // Se ainda há algum livro não devolvido → sai
  if (naoDevolvidos[0].total > 0) return;

  // Se chegou aqui → TODOS foram devolvidos
  await db.query(
    "UPDATE reservas SET status_emprestimo = 'Devolvido' WHERE id = ?",
    [reserva_id]
  );
}
