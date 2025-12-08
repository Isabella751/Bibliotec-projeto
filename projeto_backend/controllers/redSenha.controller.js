import { db } from "../config/db.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function solicitarRecuperacao(req, res) {
    const { email } = req.body;

    try {
        // Buscar usuário pelo e-mail
        const [user] = await db.execute("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (user.length === 0) {
            return res.status(404).json({ erro: "Email não encontrado" });
        }

        const usuarioId = user[0].id;

        // Criar token
        const token = crypto.randomBytes(32).toString("hex");

        // Inserir usando usuario_id
        await db.execute(
            "INSERT INTO reset_tokens (usuario_id, token, expiracao, usado) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR), 0)",
            [usuarioId, token]
        );

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "seuEmail@gmail.com",
                pass: "sua-senha-de-app"
            }
        });

        const link = `http://localhost:3000/redefinir.html?token=${token}`;

        await transporter.sendMail({
            from: "Bibliotec <seuEmail@gmail.com>",
            to: email,
            subject: "Redefinir Senha",
            html: `
                <p>Você solicitou redefinição de senha.</p>
                <p>Clique aqui: <a href="${link}">${link}</a></p>
                <p>Esse link expira em 1 hora.</p>
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
        const [row] = await db.execute(
            "SELECT * FROM reset_tokens WHERE token = ? AND expiracao > NOW() AND usado = 0",
            [token]
        );

        if (row.length === 0) {
            return res.status(400).json({ erro: "Token inválido ou expirado." });
        }

        const usuarioId = row[0].usuario_id;

        await db.execute(
            "UPDATE usuarios SET senha = ? WHERE id = ?",
            [novaSenha, usuarioId]
        );

        // Marca token como usado
        await db.execute(
            "UPDATE reset_tokens SET usado = 1 WHERE token = ?",
            [token]
        );

        res.json({ mensagem: "Senha redefinida com sucesso!" });

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
}
