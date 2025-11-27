import { db } from "../config/db.js"
// ============================
//  Rotas CRUD
// ============================


export async function criarUsuario (req, res) {
  try {
    const { nome, cpf, email, senha, data_nascimento, celular, curso, perfil } = req.body;
    if (!nome || !cpf || !email || !senha || !data_nascimento || !celular)
      return res.status(400).json({ erro: "Campos obrigatórios" });

    if (cpf.length !== 11)
      return res.status(400).json({ erro: "CPF deve conter 11 dígitos" });

    if (senha.length < 7)
      return res.status(400).json({ erro: "Senha deve ter no mínimo 6 caracteres" });

    if (data_nascimento.length !== 10)
      return res.status(400).json({ erro: "Data de nascimento inválida" });

    if (celular.length < 10 || celular.length > 11)
      return res.status(400).json({ erro: "Número de celular inválido" });

    const editCurso = curso === undefined || curso === "" ? null : curso;
    const editPerfil = perfil === undefined || perfil === "" ? "visitante" : perfil;

    await db.execute(
      "INSERT INTO usuarios (nome, cpf, email, senha, data_nascimento, celular, curso, perfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [nome, cpf, email, senha, data_nascimento, celular, editCurso, editPerfil]
    );

    res.json({ mensagem: "Usuário criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};


export async function listarUsuarios (req, res) {
  try {
    const [rows] = await db.execute("SELECT * FROM usuarios");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};


export async function obterUsuario (req, res) {
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
};

export async function editarUsuario (req, res) {
  try {
    const { nome, cpf, email, senha, data_nascimento, celular, curso, perfil } = req.body;
    if (!nome || !cpf || !email || !senha || !data_nascimento || !celular)
      return res.status(400).json({ erro: "Campos obrigatórios" });

    if (cpf.length !== 11)
      return res.status(400).json({ erro: "CPF deve conter 11 dígitos" });

    if (senha.length < 7)
      return res.status(400).json({ erro: "Senha deve ter no mínimo 6 caracteres" });

    if (data_nascimento.length !== 10)
      return res.status(400).json({ erro: "Data de nascimento inválida" });

    if (celular.length < 10 || celular.length > 11)
      return res.status(400).json({ erro: "Número de celular inválido" });

    const editCurso = curso === undefined || curso === "" ? null : curso;
    const editPerfil = perfil === undefined || perfil === "" ? "visitante" : perfil;

    await db.execute(
      "UPDATE usuarios SET nome = ?, cpf = ?, email = ?, senha = ?, data_nascimento = ?, celular = ?, curso = ?, perfil = ? WHERE id = ?",
      [nome, cpf, email, senha, data_nascimento, celular, editCurso, editPerfil, req.params.id]
    );
    res.json({ mensagem: "Usuário atualizado com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};


export async function deletarUsuario (req, res) {
  try {
    await db.execute("DELETE FROM usuarios WHERE id = ?", [req.params.id]);
    res.json({ mensagem: "Usuário deletado com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};