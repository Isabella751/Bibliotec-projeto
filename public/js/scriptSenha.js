document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("form-solicitar");
    const reenviarContainer = document.getElementById("container-reenvio");
    const link = document.getElementById("reenviar");
    const timerSpan = document.getElementById("timer");
    const btnEnviar = document.getElementById("enviar");

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
                tempo = 30;
            }
        }, 1000);
    }

    function atualizarTexto() {
        timerSpan.textContent = ` (${tempo}s)`;
    }


    // ENVIAR EMAIL AO BACKEND
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        if (!email) return alert("Digite um email válido.");

        btnEnviar.textContent = "Enviando...";
        btnEnviar.disabled = true;

        const resposta = await fetch("http://localhost:3000/senha/recuperar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        btnEnviar.textContent = "Solicitar";
        btnEnviar.disabled = false;

        const data = await resposta.json();

        if (!resposta.ok) {
            return alert(data.erro);
        }

        alert("Email enviado! Verifique sua caixa de entrada.");

        reenviarContainer.style.display = "block";
        iniciarTimer();
    });


    // REENVIAR O CÓDIGO
    link.addEventListener("click", async () => {

        const email = document.getElementById("email").value.trim();
        if (!email) return;

        link.textContent = "Reenviando...";
        link.classList.add("desativado");
        link.style.pointerEvents = "none";

        await fetch("http://localhost:3000/senha/recuperar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        link.textContent = "Código reenviado!";
        tempo = 30;

        setTimeout(() => iniciarTimer(), 1500);
    });

});
