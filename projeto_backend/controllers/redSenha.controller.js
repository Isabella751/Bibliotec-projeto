import { db } from "../config/db.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ============================
// Configuração do Nodemailer
// ============================
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

// Função para gerar o template HTML padronizado (REPETIR NO ARQUIVO DE RECUPERAÇÃO DE SENHA TAMBÉM)
function gerarTemplateEmail(titulo, conteudoHtml, notaAviso) {
    // Estilo do botão padronizado
    const estiloBotao = `
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
    `;

    // Substitui o placeholder para o estilo do botão (se existir)
    let htmlComEstilo = conteudoHtml.replace(/\{\{ESTILO_BOTAO\}\}/g, estiloBotao);

    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; font-size: 1rem; color: #333333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
            <div style="background-color: #2FD6CB; color: white; padding: 25px; text-align: center; border-bottom: 4px solid #1CABA2;">
                <h2 style="margin: 0; font-size: 1.5rem;">Bibliotec - ${titulo}</h2>
            </div>
            
            <div style="padding: 30px;">
                ${htmlComEstilo}
                
                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 15px;">
                    Atenciosamente,<br>
                    Equipe Bibliotec - Suporte
                </p>
            </div>
            
            <div style="background-color: #f8f9fa; color: #6c757d; padding: 15px; text-align: center; font-size: 12px; border-top: 1px solid #e0e0e0;">
                <p style="margin: 0;">${notaAviso}</p>
            </div>
        </div>
    `;
}

// ... (imports e Configuração do Nodemailer mantidos) ...
// ... (função gerarTemplateEmail mantida) ...

export async function solicitarRecuperacao(req, res) {
    const { email } = req.body;

    try {
        const [user] = await db.execute("SELECT id FROM usuarios WHERE email = ?", [email]);
        // Você pode incluir uma busca na tabela 'admins' também, se for o caso

        if (user.length === 0) {
            // É uma boa prática de segurança retornar um sucesso mesmo que o email não exista,
            // para não revelar quais emails estão cadastrados. No entanto, mantendo a lógica atual:
            return res.status(404).json({ erro: "Email não encontrado" });
        }

        const usuarioId = user[0].id;

        // TOKEN RANDÔMICO
        const token = crypto.randomBytes(32).toString("hex");
        const linkCompleto = `http://localhost:3000/redSenha.html?token=${token}`;

        // SALVAR TOKEN POR 15 MIN
        await db.execute(
            `INSERT INTO reset_tokens (usuario_id, token, expiracao, usado) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE), 0)`,
            [usuarioId, token]
        );

        // Calcula a data/hora de expiração (15 minutos)
        const dataExpiracao = new Date(Date.now() + 15 * 60 * 1000).toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });


        const conteudoHtml = `
            <p>Recebemos uma solicitação para **redefinir a senha** de sua conta Bibliotec.</p>
            
            <p>Para prosseguir, clique no botão abaixo e defina sua nova senha:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${linkCompleto}" style="{{ESTILO_BOTAO}}">
                    Redefinir minha senha
                </a>
            </div>

            <p style="font-size: 14px; color: #808080ff; text-align: center; padding: 10px; border-radius: 6px;">
                <b>Atenção:</b> Este link de redefinição de senha é <b>válido apenas por 15 minutos</b>. Expira em **${dataExpiracao}**.
            </p>
        `;

        // CHAMA O TEMPLATE PADRONIZADO
        const htmlFinal = gerarTemplateEmail(
            "Redefinição de Senha",
            conteudoHtml,
            "Se você não solicitou esta redefinição, por favor, ignore esta mensagem. Sua senha permanecerá inalterada."
        );


        await transporter.sendMail({
            from: "Bibliotec <bibliotec.suport@gmail.com>",
            to: email,
            subject: "Redefinir Senha - Bibliotec",
            html: htmlFinal // Usa o HTML gerado pelo template
        });

        res.json({ mensagem: "Email enviado com sucesso!" });

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
}

export async function redefinirSenha(req, res) {
    const { token, novaSenha } = req.body;

    try {
        // VERIFICA SE TOKEN EXISTE, NÃO FOI USADO E NÃO ESTÁ EXPIRADO
        const [rows] = await db.execute(
            `SELECT * FROM reset_tokens
             WHERE token = ? AND usado = 0 AND expiracao > NOW()`,
            [token]
        );

        // ... restante do código da função
        res.json({ mensagem: "Senha redefinida com sucesso!" });

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
}

// ... (Manter a função redefinirSenha e todas as outras funções) ...