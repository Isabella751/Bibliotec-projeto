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


document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnCadastrar");

    btn.addEventListener("click", async () => {

        // Validação básica — sem machismo
        if (!document.getElementById("termos").checked) {
            alert("Você precisa aceitar os termos antes de continuar.");
            return;
        }

        const payload = {
            nome: document.getElementById("nome").value.trim(),
            cpf: document.getElementById("cpf").value.trim(),
            email: document.getElementById("email").value.trim(),
            senha: document.getElementById("senha").value.trim(),
            data_nascimento: document.getElementById("data_nascimento").value,
            celular: document.getElementById("celular").value.trim(),
            curso: document.getElementById("curso").value,
            perfil: document.getElementById("perfil").value
        };

        console.log("Payload enviado:", payload);

        try {
            const resposta = await fetch("http://localhost:3000/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await resposta.json();
            console.log("Resposta do backend:", data);

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

