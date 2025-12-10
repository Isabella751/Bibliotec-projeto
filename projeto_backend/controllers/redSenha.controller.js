import { db } from "../config/db.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function solicitarRecuperacao(req, res) {
    const { email } = req.body;

    try {
        const [user] = await db.execute("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (user.length === 0) {
            return res.status(404).json({ erro: "Email não encontrado" });
        }

        const usuarioId = user[0].id;

        // TOKEN RANDÔMICO
        const token = crypto.randomBytes(32).toString("hex");

        // SALVAR TOKEN POR 15 MIN
        await db.execute(
            `INSERT INTO reset_tokens (usuario_id, token, expiracao, usado)
             VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE), 0)`,
            [usuarioId, token]
        );

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "gigisantanasilva@gmail.com",
                pass: "tubu ajfw maie zfzy"
            }
        });

        const link = `http://localhost:3000/redSenha.html?token=${token}`;

        await transporter.sendMail({
            from: "gigisantanasilva@gmail.com",
            to: email,
            subject: "Redefinir Senha",
            html: `
                <p>Você solicitou redefinição de senha.</p>
                <p>Clique aqui: <a href="${link}">${link}</a></p>
                <p>Esse link expira em 15 minutos.</p>
            `
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

        if (rows.length === 0) {
            return res.status(400).json({ erro: "Token inválido ou expirado." });
        }

        const usuarioId = rows[0].usuario_id;

        // ALTERAR SENHA
        await db.execute(
            "UPDATE usuarios SET senha = ? WHERE id = ?",
            [novaSenha, usuarioId]
        );

        // MARCAR TOKEN COMO USADO
        await db.execute(
            "UPDATE reset_tokens SET usado = 1 WHERE token = ?",
            [token]
        );

        res.json({ mensagem: "Senha redefinida com sucesso!" });

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
}
