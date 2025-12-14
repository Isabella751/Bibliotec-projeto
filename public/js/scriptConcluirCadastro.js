document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formDefinirSenha");
    const mensagem = document.getElementById("mensagem");

    // 1. Obter email e token da URL
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const token = params.get('token');

    if (!email || !token) {
        mensagem.textContent = "Link de conclusão inválido ou expirado. Contate o administrador.";
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const novaSenha = document.getElementById("novaSenha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        if (novaSenha !== confirmarSenha) {
            alert("As senhas não coincidem.");
            return;
        }

        if (novaSenha.length < 8) {
            alert("A senha deve ter no mínimo 8 caracteres.");
            return;
        }

        const payload = {
            email,
            token,
            novaSenha
        };

        try {
            // 2. Enviar dados para o NOVO endpoint do backend
            // Linha 25 em scriptConcluirCadastro.js:
            // DE: const resposta = await fetch("http://localhost:3000/definir-senha", { ...
            // PARA:
            const resposta = await fetch("http://localhost:3000/usuarios/definir-senha", {
                // ..., {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await resposta.json();

            if (!resposta.ok) {
                mensagem.textContent = data.erro || "Falha ao definir a senha. Verifique se o link não expirou.";
                return;
            }

            // Sucesso!
            mensagem.textContent = "Senha definida com sucesso! Você pode fazer login agora.";
            // Redireciona para a tela de login
            setTimeout(() => {
                window.location.href = "login.html";
            }, 3000);

        } catch (erro) {
            console.error("Erro na requisição:", erro);
            mensagem.textContent = "Erro ao conectar com o servidor.";
        }
    });
});