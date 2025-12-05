import { db } from "../config/db.js";

export async function login(req, res) {
    const { email, senha } = req.body;

    try {
        // Verifica se é ADMIN
        const [admin] = await db.query(
            "SELECT * FROM admins WHERE email = ? AND senha = ?",
            [email, senha]
        );

        if (admin.length > 0) {
            return res.json({ tipo: "Admin", message: "Login admin" });
        }

        //  Verifica se é USUÁRIO
        const [usuario] = await db.query(
            "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
            [email, senha]
        );

        if (usuario.length > 0) {
            return res.json({ tipo: "Aluno", message: "Login usuário" });
        }

        // Nenhum encontrado
        return res.status(401).json({ erro: "Credenciais inválidas" });

    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ erro: "Erro no login", detalhe: error });
    }
}
