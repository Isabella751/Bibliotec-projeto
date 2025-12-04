import { db } from "../config/db.js";
// ============================
//  Rotas CRUD
// ============================

function emptyToNull(value) {
  return value === "" || value == null ? null : value;
}

export async function criarUsuario(req, res) {
  try {
    const { nome, cpf, email, senha, data_nascimento, celular, curso } =
      req.body;

    if (!nome || !email || !senha || !data_nascimento || !cpf || !curso)
      return res.status(400).json({ erro: "Campos obrigatórios" });

    //  Verifica se CPF já existe
    const [rows] = await db.execute("SELECT cpf FROM usuarios WHERE cpf = ?", [
      cpf,
    ]);

    if (rows.length > 0) {
      return res.status(400).json({ erro: "CPF já cadastrado!" });
    }

    // Remove mascara (pontos e traço)
    const cpfLimpo = cpf.replace(/\D/g, "");

    if (!Number(cpfLimpo) || cpfLimpo.length !== 11) {
      return res.status(400).json({ erro: "CPF inválido!" });
    }

    const celularValue = emptyToNull(celular);

    await db.execute(
      "INSERT INTO usuarios (nome, cpf, email, senha, data_nascimento, celular, curso) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        nome,
        cpfLimpo,
        email,
        senha,
        data_nascimento,
        celularValue,
        curso
      ]
    );
    res.status(201).json({ mensagem: "Usuário criado com sucesso!" });
  } catch (err) {
    //  Se o CPF já existir no banco
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ erro: "CPF já está cadastrado!" });
    }

    res.status(500).json({ erro: err.message });
  }
}

export async function listarUsuarios(req, res) {
  try {
    const [rows] = await db.execute("SELECT * FROM usuarios");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function obterUsuario(req, res) {
  try {
    const [rows] = await db.execute("SELECT * FROM usuarios WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function atualizarUsuario(req, res) {
  try {
    const { nome, celular, curso } =
      req.body;
    const id = req.params.id;

    const [resultado] = await db.execute(
      "SELECT cpf FROM usuarios WHERE id = ?",
      [id]
    );

    if (resultado.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    if (!nome || !curso) {
      return res.status(400).json({ erro: "Campos obrigatórios" });
    }

    const cpfAtual = resultado[0].cpf;

    // Se tentar mudar o CPF
    if (cpf && cpf !== cpfAtual) {
      return res.status(400).json({ erro: "Não é permitido alterar o CPF" });
    }

    const celularValue = emptyToNull(celular);

    await db.execute(
      `UPDATE usuarios 
            SET nome = ?, celular = ?, curso = ?
            WHERE id = ?`,
      [nome, celularValue, curso, id]
    );

    return res.json({ mensagem: "Usuário atualizado com sucesso!" });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function deletarUsuario(req, res) {
  try {
    await db.execute("DELETE FROM usuarios WHERE id = ?", [req.params.id]);
    res.json({ mensagem: "Usuário deletado com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
