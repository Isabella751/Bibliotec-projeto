import { db } from "../config/db.js";

export async function obterAdmin(req, res) {
  try {
    const [rows] = await db.execute("SELECT * FROM admins WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ erro: "Admin não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function obterAdminPorEmail(req, res) {
  try {
    const email = req.params.email;
    console.log("Buscando admin por email:", email);

    const [rows] = await db.execute(
      `
  SELECT 
    id,
    nome,
    email,
    criado_em
  FROM admins
  WHERE email = ?
`,
      [email]
    );

    console.log("Resultado da query:", rows);

    if (rows.length === 0)
      return res.status(404).json({ erro: "Admin não encontrado" });

    console.log("Enviando dados:", rows[0]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar admin por email:", err);
    res.status(500).json({ erro: err.message });
  }
}