// controllers/login.controller.js
import { db } from "../config/db.js";

export async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: "Email e senha são obrigatórios" });
        }

        const [rows] = await db.execute(
            "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
            [email, senha]
        );

        if (rows.length === 0) {
            return res.status(401).json({ erro: "Credenciais inválidas" });
        }

        return res.status(200).json({ mensagem: "Login realizado!", usuario: rows[0] });

    } catch (err) {
        return res.status(500).json({ erro: err.message });
    }
}
