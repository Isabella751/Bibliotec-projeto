import bcrypt from "bcrypt";

export async function alterarSenha(req, res) {
    const { token, senha } = req.body;

    const [usuario] = await db.execute(
        "SELECT * FROM usuarios WHERE reset_token = ?",
        [token]
    );

    if (!usuario.length || usuario[0].reset_token_expira < new Date()) {
        return res.status(400).json({ erro: "Token inválido ou expirado" });
    }

    const hash = await bcrypt.hash(senha, 10);

    await db.execute(
        "UPDATE usuarios SET senha = ?, reset_token = NULL, reset_token_expira = NULL WHERE id = ?",
        [hash, usuario[0].id]
    );

    res.json({ msg: "Senha alterada com sucesso!" });

}
