import { db } from "../config/db.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ATENÇÃO: A função gerarHashSenha foi removida e a criptografia desativada
// a pedido do usuário. Isso é INSEGURO para ambientes de produção.

// ============================
//  Rotas CRUD e Funções Auxiliares
// ============================

function emptyToNull(value) {
    return value === "" || value == null ? null : value;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

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

    if (isNaN(data.getTime())) return false;

    const ano = data.getUTCFullYear();
    const hoje = new Date();

    if (ano < 1900) return false;
    if (data > hoje) return false;

    return true;
}

// Função auxiliar para enviar o email de definição de senha
async function enviarEmailDefinirSenha(email, token) {
    // Calcula a data/hora de expiração (15 minutos)
    const dataExpiracao = new Date(Date.now() + 15 * 60 * 1000).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // O link aponta para sua nova rota no frontend
    const linkCompleto = `http://localhost:3000/concluirCadastro.html?email=${email}&token=${token}`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "bibliotec.suport@gmail.com",
            pass: "amxn npaq gypi ihaf",
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    await transporter.sendMail({
        from: "Bibliotec <bibliotec.suport@gmail.com>",
        to: email,
        subject: "Conclua seu cadastro - Bibliotec", 
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; font-size: 1rem; color: #333333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                <div style="background-color: #2FD6CB; color: white; padding: 25px; text-align: center; border-bottom: 4px solid #1CABA2;">
                    <h2 style="margin: 0; font-size: 1.5rem;">Bem-vindo(a) à Bibliotec!</h2>
                </div>
                
                <div style="padding: 30px;">
                    <p>Prezado(a) Aluno(a),</p>
                    
                    <p>Seu cadastro como usuário da Bibliotec foi <b>criado com sucesso</b> em nosso sistema. Agora, precisamos apenas que você defina sua senha.</p>
                    
                    <p>Para garantir a segurança de sua conta e finalizar seu acesso, por favor, defina sua senha clicando no botão abaixo:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${linkCompleto}" style="
                            background-color: #4a67df; 
                            color: white; 
                            padding: 15px 30px; 
                            text-decoration: none; 
                            border-radius: 8px; 
                            font-size: 17px; 
                            font-weight: bold; 
                            display: inline-block; 
                            transition: background-color 0.3s;
                            box-shadow: 0 4px 10px rgba(74, 103, 223, 0.4);
                            max-width: 300px; 
                            width: 100%; 
                        ">
                            Definir minha senha agora
                        </a>
                    </div>
                    
                    <p style="font-size: 14px; color: #808080ff; text-align: center; padding: 10px; border-radius: 6px;">
                        <b>Atenção:</b> Este link de acesso é <b>válido apenas por 15 minutos</b>. Expira em <b>${dataExpiracao}</b>.
                    </p>

                    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 15px;">
                        Atenciosamente,<br>
                        Equipe Bibliotec - Suporte
                    </p>
                </div>
                
                <div style="background-color: #f8f9fa; color: #6c757d; padding: 15px; text-align: center; font-size: 12px; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0;">Se você não solicitou este cadastro, por favor, ignore esta mensagem ou entre em contato conosco imediatamente.</p>
                </div>
            </div>
        `,
    });
}

export async function criarUsuario(req, res) {
    try {
        const {
            nome,
            cpf,
            email,
            senha, // Para Admin, será a senha; Para Aluno, será ""
            data_nascimento,
            celular,
            curso,
            perfil: perfilRecebido,
        } = req.body;

        const perfil = perfilRecebido && String(perfilRecebido).toLowerCase() === "admin" ? "Admin" : "Aluno";
        
        // ==========================================================
        // VALIDAÇÕES
        // ==========================================================
        if (!nome || !email || !cpf) {
            return res.status(400).json({ erro: "Campos obrigatórios: Nome, Email, CPF." });
        }
        if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
            return res.status(400).json({ erro: "Nome inválido. Use apenas letras." });
        }
        const cpfLimpo = String(cpf).replace(/\D/g, "");
        if (!validarCPF(cpfLimpo)) {
            return res.status(400).json({ erro: "CPF inválido!" });
        }
        
        // Verifica se CPF ou email já existe
        const [usuariosCpf] = await db.execute("SELECT cpf FROM usuarios WHERE cpf = ?", [cpfLimpo]);
        const [adminsCpf] = await db.execute("SELECT cpf FROM admins WHERE cpf = ?", [cpfLimpo]);
        if (usuariosCpf.length > 0 || adminsCpf.length > 0) {
            return res.status(400).json({ erro: "CPF já cadastrado!" });
        }
        const [usuariosEmail] = await db.execute("SELECT email FROM usuarios WHERE email = ?", [email]);
        const [adminsEmail] = await db.execute("SELECT email FROM admins WHERE email = ?", [email]);
        if (usuariosEmail.length > 0 || adminsEmail.length > 0) {
            return res.status(400).json({ erro: "Email já cadastrado!" });
        }
        // ==========================================================


        let senhaFinal = null;
        let tokenVerificacao = null;
        let expiracaoToken = null;

        if (perfil === "Admin") {
            // Admin: Senha é obrigatória, armazenada em TEXTO PURO.
            if (!senha || senha.length < 8) {
                return res.status(400).json({ erro: "Senha de Admin deve ter no mínimo 8 caracteres." });
            }
            
            // SENHA EM TEXTO PURO (RISCO DE SEGURANÇA)
            senhaFinal = senha; 

            // Insere na tabela admins
            await db.execute(
                "INSERT INTO admins (nome, cpf, email, senha, perfil) VALUES (?, ?, ?, ?, ?)",
                [nome, cpfLimpo, email, senhaFinal, perfil]
            );
            return res.status(201).json({ mensagem: "Admin criado com sucesso!" });

        } else if (perfil === "Aluno") {
            // Aluno: Senha é ignorada, gera token e dispara e-mail.
            if (!data_nascimento || !curso) {
                return res.status(400).json({ erro: "Campos obrigatórios para Aluno: Data de Nascimento e Curso." });
            }
            if (!validarData(data_nascimento)) {
                return res.status(400).json({ erro: "Data de nascimento inválida!" });
            }
            
            // Gerar Token e Data de Expiração
            tokenVerificacao = crypto.randomBytes(20).toString('hex');
            expiracaoToken = new Date(Date.now() + 15 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '); 
            
            const celularValue = emptyToNull(celular);

            // 1. Insere o usuário com senha NULL e token de verificação
            await db.execute(
                `INSERT INTO usuarios (nome, cpf, email, senha, data_nascimento, celular, curso, perfil, token_verificacao, expiracao_token) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    nome, cpfLimpo, email, senhaFinal, data_nascimento, 
                    celularValue, curso, perfil, tokenVerificacao, expiracaoToken
                ]
            );
            
            // 2. Envia o email (Pode ser a causa do ECONNRESET, então vamos mantê-lo)
            await enviarEmailDefinirSenha(email, tokenVerificacao);

            return res.status(201).json({ 
                mensagem: "Cadastro de Aluno realizado. Email enviado para definição de senha!" 
            });
        }
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ erro: "CPF ou email já está cadastrado!" });
        }
        // Registra o erro detalhado no console para rastreamento de ECONNRESET
        console.error("Erro no criarUsuario:", err.message); 
        res.status(500).json({ erro: "Erro interno do servidor. Detalhe: " + err.message });
    }
}


export async function definirSenhaPorToken(req, res) {
    try {
        const { email, token, novaSenha } = req.body;

        // 1. Validação básica
        if (!email || !token || !novaSenha) {
            return res.status(400).json({ erro: "Dados obrigatórios ausentes." });
        }
        if (novaSenha.length < 8) {
            return res.status(400).json({ erro: "A senha deve ter no mínimo 8 caracteres." });
        }

        // 2. Buscar o usuário pelo email E token, verificando a expiração
        const [rows] = await db.execute(
            `
            SELECT id, expiracao_token FROM usuarios 
            WHERE email = ? AND token_verificacao = ?
            `,
            [email, token]
        );

        if (rows.length === 0) {
            return res.status(400).json({ erro: "Link inválido ou já utilizado." });
        }

        const usuario = rows[0];
        const dataExpiracao = new Date(usuario.expiracao_token).getTime();
        const agora = Date.now();

        // 3. Verificar se o token expirou
        if (agora > dataExpiracao) {
            await db.execute(
                `UPDATE usuarios SET token_verificacao = NULL, expiracao_token = NULL WHERE id = ?`,
                [usuario.id]
            );
            return res.status(400).json({ erro: "O link de definição de senha expirou. Contate o administrador." });
        }

        // 4. Armazena a senha em TEXTO PURO
        const senhaTextoPuro = novaSenha;

        // 5. Atualizar a senha e limpar os campos de token
        await db.execute(
            `
            UPDATE usuarios 
            SET senha = ?, token_verificacao = NULL, expiracao_token = NULL 
            WHERE id = ?
            `,
            [senhaTextoPuro, usuario.id]
        );

        res.json({ mensagem: "Senha definida com sucesso!" });

    } catch (err) {
        console.error("Erro ao definir senha por token:", err);
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
}


export async function enviarCodigoVerificacao(usuarioId, email) {
    // ... (Funções inalteradas) ...
    const codigo = Math.floor(10000 + Math.random() * 90000).toString();

    await db.execute(
        "INSERT INTO email_verificacao (usuario_id, codigo, expiracao) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))",
        [usuarioId, codigo]
    );

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "bibliotec.suport@gmail.com",
            pass: "amxn npaq gypi ihaf",
        },
    });

    await transporter.sendMail({
        from: "Bibliotec <bibliotec.suport@gmail.com>",
        to: email,
        subject: "Confirmação de Email",
        html: `
            <p>Seu código de verificação é:</p>
            <h1 style="font-size: 32px; letter-spacing: 8px;">${codigo}</h1>
            <p>Ele expira em 15 minutos.</p>
        `,
    });

    return true;
}

export async function validarCodigo(req, res) {
    const { usuarioId, codigo } = req.body;

    const [rows] = await db.execute(
        `
            SELECT * FROM email_verificacao 
            WHERE usuario_id = ? AND codigo = ? AND usado = 0 AND expiracao > NOW()
        `,
        [usuarioId, codigo]
    );

    if (rows.length === 0) {
        return res.status(400).json({ erro: "Código inválido ou expirado." });
    }

    await db.execute(
        `
            UPDATE email_verificacao SET usado = 1 WHERE id = ?
        `,
        [rows[0].id]
    );

    await db.execute(
        `
            UPDATE usuarios SET email_confirmado = 1 WHERE id = ?
        `,
        [usuarioId]
    );

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

        const [rows] = await db.execute(
            `
            SELECT 
                id,
                nome,
                email,
                curso,
                data_nascimento,
                criado_em
            FROM usuarios 
            WHERE email = ?
        `,
            [email]
        );

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
        const { nome, celular, curso, cpf } = req.body;
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

// --- Adicione esta nova função ao final do seu usuario.controller.js ---

export async function loginUsuario(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: "Email e senha são obrigatórios." });
        }

        // 1. Tentar encontrar o usuário na tabela 'usuarios'
        const [usuariosRows] = await db.execute(
            `SELECT id, senha FROM usuarios WHERE email = ?`,
            [email]
        );

        let usuario = null;
        let perfil = null;
        
        if (usuariosRows.length > 0) {
            usuario = usuariosRows[0];
            perfil = 'Aluno';
        } else {
            // 2. Se não encontrou, tentar encontrar na tabela 'admins'
            const [adminsRows] = await db.execute(
                `SELECT id, senha FROM admins WHERE email = ?`,
                [email]
            );
            if (adminsRows.length > 0) {
                usuario = adminsRows[0];
                perfil = 'Admin';
            }
        }

        if (!usuario) {
            return res.status(401).json({ erro: "Email ou senha incorretos." });
        }
        
        // 3. Verifica a senha (em TEXTO PURO, conforme seu código)
        // ATENÇÃO: Se você tivesse criptografia, usaria uma função de comparação de hash aqui.
        if (usuario.senha !== senha) {
             return res.status(401).json({ erro: "Email ou senha incorretos." });
        }

        // 4. SUCESSO: Retorna o ID do usuário e o perfil
        res.json({ 
            mensagem: "Login realizado com sucesso!",
            userId: usuario.id,
            perfil: perfil
            // Não estamos gerando Token JWT aqui para simplicidade, apenas o ID.
        });

    } catch (err) {
        console.error("Erro no login:", err);
        res.status(500).json({ erro: "Erro interno do servidor ao tentar login." });
    }
}