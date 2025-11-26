import { db } from "../config/db.js";

// ============================
//  Rotas CRUD
// ============================

export async function criarReserva(req, res) {
  try {
    const { usuario_id, itens } = req.body;

    if (!usuario_id || !itens || itens.length === 0)
      return res.status(400).json({ erro: "Dados incompletos para criar reserva" });

    // Valida usuário
    const [user] = await db.query("SELECT id FROM usuarios WHERE id = ?", [usuario_id]);
    if (user.length === 0)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    // Valida livros
    for (const item of itens) {
      const [livro] = await db.query("SELECT id FROM livros WHERE id = ?", [item.livro_id]);
      if (livro.length === 0)
        return res.status(404).json({ erro: `Livro ID ${item.livro_id} não encontrado` });
    }

    // Cria a reserva
    const [resInsert] = await db.query(
      "INSERT INTO reservas (usuario_id, data_reserva, status_reserva) VALUES (?, NOW(), 'pendente')",
      [usuario_id]
    );

    const reserva_id = resInsert.insertId;

    // Inseri itens
    for (const item of itens) {
      await db.query(
        "INSERT INTO reserva_itens (reserva_id, livro_id) VALUES (?, ?)",
        [reserva_id, item.livro_id || 1]
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
        r.data_reserva,
        r.data_devolucao,
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

    // Remove itens
    await db.query("DELETE FROM reservas_itens WHERE reserva_id = ?", [id]);

    // Remove reserva
    await db.query("DELETE FROM reservas WHERE id = ?", [id]);

    res.json({ msg: "Reserva removida com sucesso" });

  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}
