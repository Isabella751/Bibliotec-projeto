





































































































import { db } from "../config/db.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
// ============================
//  Rotas CRUD
// ============================

function emptyToNull(value) {
  return value === "" || value == null ? null : value;
}


function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false; // bloqueia CPFs tipo 11111111111

  let soma = 0;
  let resto;

  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  // Segundo dígito verificador
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10))) return false;

  return true;
}

function validarData(dataStr) {
  const data = new Date(dataStr);

  if (isNaN(data.getTime())) return false; // Data inválida

  const ano = data.getUTCFullYear();
  const hoje = new Date();

  if (ano < 1900) return false;
  if (data > hoje) return false;

  return true;
}

export async function criarUsuario(req, res) {
  try {
    const { nome, cpf, email, senha, data_nascimento, celular, curso } =
      req.body;

    // Verifica obrigatórios
    if (!nome || !email || !senha || !data_nascimento || !cpf || !curso)
      return res.status(400).json({ erro: "Campos obrigatórios" });

    // Valida data real
    if (!validarData(data_nascimento)) {
      return res.status(400).json({ erro: "Data de nascimento inválida!" });
    }

    // Nome sem números
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
      return res.status(400).json({ erro: "Nome inválido. Use apenas letras." });
    }

    // Limpa CPF
    const cpfLimpo = cpf.replace(/\D/g, "");

    // Valida CPF matematicamente
    if (!validarCPF(cpfLimpo)) {
      return res.status(400).json({ erro: "CPF inválido!" });
    }

    // Verifica se CPF já existe
    const [rows] = await db.execute("SELECT cpf FROM usuarios WHERE cpf = ?", [
      cpfLimpo,
    ]);

    if (rows.length > 0) {
      return res.status(400).json({ erro: "CPF já cadastrado!" });
    }

    const celularValue = emptyToNull(celular);

    await db.execute(
      "INSERT INTO usuarios (nome, cpf, email, senha, data_nascimento, celular, curso) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nome, cpfLimpo, email, senha, data_nascimento, celularValue, curso]
    );

    res.status(201).json({ mensagem: "Usuário criado com sucesso!" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ erro: "CPF já está cadastrado!" });
    }

    res.status(500).json({ erro: err.message });
  }
}



export async function enviarCodigoVerificacao(usuarioId, email) {

  // Código de 5 dígitos
  const codigo = Math.floor(10000 + Math.random() * 90000).toString();

  // Salvar no banco (expira em 10 min)
  await db.execute(
    "INSERT INTO email_verificacao (usuario_id, codigo, expiracao) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))",
    [usuarioId, codigo]
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "gigisantanasilva@gmail.com",
      pass: "tubu ajfw maie zfzy"
    }
  });

  await transporter.sendMail({
    from: "Bibliotec <gigisantanasilva@gmail.com>",
    to: email,
    subject: "Confirmação de Email",
    html: `
            <p>Seu código de verificação é:</p>
            <h1 style="font-size: 32px; letter-spacing: 8px;">${codigo}</h1>
            <p>Ele expira em 10 minutos.</p>
        `
  });

  return true;
}

export async function validarCodigo(req, res) {
  const { usuarioId, codigo } = req.body;

  const [rows] = await db.execute(`
        SELECT * FROM email_verificacao 
        WHERE usuario_id = ? AND codigo = ? AND usado = 0 AND expiracao > NOW()
    `, [usuarioId, codigo]);

  if (rows.length === 0) {
    return res.status(400).json({ erro: "Código inválido ou expirado." });
  }

  await db.execute(`
        UPDATE email_verificacao SET usado = 1 WHERE id = ?
    `, [rows[0].id]);

  await db.execute(`
        UPDATE usuarios SET email_confirmado = 1 WHERE id = ?
    `, [usuarioId]);

  res.json({ mensagem: "E-mail confirmado com sucesso!" });
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

export async function obterUsuarioPorEmail(req, res) {
  try {
    const email = req.params.email;
    console.log("Buscando usuário por email:", email);

    const [rows] = await db.execute("SELECT id, nome, email, curso FROM usuarios WHERE email = ?", [
      email,
    ]);

    console.log("Resultado da query:", rows);

    if (rows.length === 0)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    console.log("Enviando dados:", rows[0]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar usuário por email:", err);
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
