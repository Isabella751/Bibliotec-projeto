document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("form-solicitar");
    const reenviarContainer = document.getElementById("container-reenvio");
    const link = document.getElementById("reenviar");
    const timerSpan = document.getElementById("timer");

    let tempo = 30;
    let interval;

    function iniciarTimer() {
        link.classList.add("desativado");
        link.style.pointerEvents = "none";
        atualizarTexto();

        interval = setInterval(() => {
            tempo--;
            atualizarTexto();

            if (tempo <= 0) {
                clearInterval(interval);
                link.classList.remove("desativado");
                link.style.pointerEvents = "auto";
                timerSpan.textContent = "";
                link.textContent = "Reenviar código";
                tempo = 30;
            }
        }, 1000);
    }

    function atualizarTexto() {
        timerSpan.textContent = ` (${tempo}s)`;
    }

    // Quando clicar em “Solicitar”
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // impede redirecionamento imediato

        const email = document.getElementById("email").value.trim();
        if (email === "") {
            alert("Digite um email válido.");
            return;
        }

        // Aqui seria o envio real do email
        // Mostra feedback
        document.getElementById("enviar").textContent = "Enviando...";
        document.getElementById("enviar").disabled = true;

        setTimeout(() => {
            document.getElementById("enviar").textContent = "Solicitar";
            document.getElementById("enviar").disabled = false;

            // Agora exibe a área de reenvio
            reenviarContainer.style.display = "block";

            // Inicia o timer só agora
            iniciarTimer();

            // Redireciona à página de inserir código (opcional)
            // window.location.href = "redSenha.html";

        }, 1200); // tempo simulado de envio
    });

    // Quando clicar em reenviar
    link.addEventListener("click", () => {
        link.textContent = "Código reenviado!";
        link.classList.add("desativado");
        link.style.pointerEvents = "none";

        setTimeout(() => {
            tempo = 30;
            iniciarTimer();
        }, 1500);
    });

});
