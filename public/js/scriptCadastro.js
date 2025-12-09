document.addEventListener("DOMContentLoaded", () => {

    const campos = document.querySelectorAll(".info-cadastro input, .info-cadastro select");

    campos.forEach(campo => {
        campo.addEventListener("input", () => {

            const asterisco = campo.closest(".linha_cadastro").querySelector(".obrigatorio");

            if (!asterisco) return;

            if (campo.value.trim() !== "") {
                asterisco.style.visibility = "hidden";
            } else {
                asterisco.style.visibility = "visible";
            }
        });
    });

});

const senhaInput = document.getElementById("senha");
const toggleSenha = document.getElementById("toggleSenha");

toggleSenha.addEventListener("click", () => {
    const tipoAtual = senhaInput.getAttribute("type");

    if (tipoAtual === "password") {
        senhaInput.setAttribute("type", "text");
        toggleSenha.textContent = "visibility_off";
    } else {
        senhaInput.setAttribute("type", "password");
        toggleSenha.textContent = "visibility";
    }
});

const celularInput = document.getElementById("celular");

celularInput.addEventListener("input", function (e) {
    let valor = e.target.value;

    valor = valor.replace(/\D/g, "");

    if (valor.length > 11) valor = valor.slice(0, 11);

    let formatado = "";

    if (valor.length > 0) formatado = "(" + valor.substring(0, 2);
    if (valor.length >= 3) formatado += ") " + valor.substring(2, 7);
    if (valor.length >= 8) formatado += "-" + valor.substring(7, 11);

    e.target.value = formatado;
});

const cpfInput = document.getElementById("cpf");

cpfInput.addEventListener("input", function (e) {
    let valor = e.target.value;

    valor = valor.replace(/\D/g, "");

    if (valor.length > 11) valor = valor.slice(0, 11);

    let formatado = "";

    if (valor.length > 0) formatado = valor.substring(0, 3);
    if (valor.length >= 4) formatado += "." + valor.substring(3, 6);
    if (valor.length >= 7) formatado += "." + valor.substring(6, 9);
    if (valor.length >= 10) formatado += "-" + valor.substring(9, 11);

    e.target.value = formatado;
});

function finalizarCadastro() {

    if (window.opener && !window.opener.closed) {
        window.opener.location.href = "inicio.html";
    }

    window.close();
}

// Impedir números no campo nome
const nomeInput = document.getElementById("nome");

nomeInput.addEventListener("input", () => {
    nomeInput.value = nomeInput.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
});


document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnCadastrar");

    btn.addEventListener("click", async () => {

        // Termos
        if (!document.getElementById("termos").checked) {
            alert("Você precisa aceitar os termos antes de continuar.");
            return;
        }

        // Coleta valores
        const nome = document.getElementById("nome").value.trim();
        const cpf = document.getElementById("cpf").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();
        const data_nascimento = document.getElementById("data_nascimento").value;
        const celular = document.getElementById("celular").value.trim();
        const curso = document.getElementById("curso").value;
        const perfil = document.getElementById("perfil") ? document.getElementById("perfil").value : "aluno";

        // Validações

        //  Nome sem números
        if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
            alert("O nome não pode conter números ou caracteres inválidos.");
            return;
        }

        //  CPF com 11 números (antes de formatar)
        const cpfLimpo = cpf.replace(/\D/g, "");
        if (cpfLimpo.length !== 11) {
            alert("O CPF deve conter 11 números.");
            return;
        }

        //  Email válido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Digite um email válido (exemplo: usuario@gmail.com).");
            return;
        }

        //  Senha com mínimo 8 caracteres
        if (senha.length < 8) {
            alert("A senha deve ter no mínimo 8 caracteres.");
            return;
        }

        //  Curso obrigatório
        if (!curso) {
            alert("Selecione um curso.");
            return;
        }

        //  Data obrigatória
        if (!data_nascimento) {
            alert("Informe sua data de nascimento.");
            return;
        }

        const payload = {
            nome,
            cpf,
            email,
            senha,
            data_nascimento,
            celular,
            curso,
            perfil
        };

        try {
            const resposta = await fetch("http://localhost:3000/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await resposta.json();

            if (!resposta.ok) {
                alert(data.erro || "Erro ao cadastrar usuário.");
                return;
            }

            alert("Usuário cadastrado com sucesso!");
            window.location.href = "inicio.html";

        } catch (erro) {
            console.error("Erro na requisição:", erro);
            alert("Falha ao conectar com o servidor.");
        }

    });
});

// Permitir CADASTRO ao apertar ENTER
const formCadastro = document.getElementById("formCadastro");

formCadastro.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault(); // impede o form de recarregar
        document.getElementById("btnCadastrar").click(); // aciona o botão
    }
});
