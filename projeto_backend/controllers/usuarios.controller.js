import { db } from "../config/db.js";
// ============================
//  Rotas CRUD
// ============================

function emptyToNull(value) {
    return value === "" || value == null ? null : value;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Validação do primeiro dígito
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf[i]) * (10 - i);
    }
    let digito1 = (soma * 10) % 11;
    if (digito1 === 10 || digito1 === 11) digito1 = 0;

    if (digito1 !== parseInt(cpf[9])) return false;

    // Validação do segundo dígito
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf[i]) * (11 - i);
    }
    let digito2 = (soma * 10) % 11;
    if (digito2 === 10 || digito2 === 11) digito2 = 0;

    return digito2 === parseInt(cpf[10]);
}

export async function criarUsuario(req, res) {
    try {
        const { nome, cpf, email, senha, data_nascimento, celular, curso, perfil } = req.body;

        if (!nome || !cpf || !email || !senha || !data_nascimento || !celular)
            return res.status(400).json({ erro: "Campos obrigatórios" });

        //  Verifica se CPF já existe
        const [rows] = await db.execute(
            "SELECT cpf FROM usuarios WHERE cpf = ?",
            [cpf]
        );

        if (rows.length > 0) {
            return res.status(400).json({ erro: "CPF já cadastrado!" });
        }

        if(!Number(cpf) || cpf.length !== 11){ {
            return res.status(400).json({ erro: "CPF inválido!" });
        }}


        const dataNascimento = emptyToNull(data_nascimento);
        const celularValue = emptyToNull(celular);
        const cursoValue = emptyToNull(curso);

        await db.execute(
            "INSERT INTO usuarios (nome, cpf, email, senha, perfil, data_nascimento, celular, curso) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [nome, cpf, email, senha, perfil, dataNascimento, celularValue, cursoValue]
        );
        res.status(201).json({ mensagem: "Usuário criado com sucesso!" });
    } catch (err) {
        //  Se o CPF já existir no banco
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ erro: "CPF já está cadastrado!" });
        }

        res.status(500).json({ erro: err.message });
    }
};


export async function listarUsuarios(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM usuarios");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

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
};

export async function atualizarUsuario(req, res) {
    try {
        const { nome, email, senha, celular, data_nascimento, curso, cpf } = req.body;
        const id = req.params.id;

        const [resultado] = await db.execute(
            "SELECT cpf FROM usuarios WHERE id = ?",
            [id]
        );

        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        const cpfAtual = resultado[0].cpf;

        // Se tentar mudar o CPF
        if (cpf && cpf !== cpfAtual) {
            return res.status(400).json({ erro: "Não é permitido alterar o CPF" });
        }

        const dataNascimento = emptyToNull(data_nascimento);
        const celularValue = emptyToNull(celular);
        const cursoValue = emptyToNull(curso);

        await db.execute(
            `UPDATE usuarios 
            SET nome = ?, email = ?, senha = ?, celular = ?, data_nascimento = ?, curso = ?
            WHERE id = ?`,
            [nome, email, senha, celularValue, dataNascimento, cursoValue, id]
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
};