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

function finalizarCadastro() {

    if (window.opener && !window.opener.closed) {
        window.opener.location.href = "inicio.html";
    }

    window.close();
}
