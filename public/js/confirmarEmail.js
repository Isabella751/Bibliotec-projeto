const inputs = document.querySelectorAll(".code-input");
const verifyBtn = document.getElementById("verifyBtn");
const result = document.getElementById("result");

// Foca no primeiro input ao carregar
inputs[0].focus();

// Lógica de digitação
inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, ""); // permite só números

        if (input.value && index < inputs.length - 1) {
            inputs[index + 1].focus(); // vai pro próximo
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && index > 0) {
            inputs[index - 1].focus(); // volta pro anterior
        }
    });
});

// Botão Verificar
verifyBtn.addEventListener("click", () => {
    const code = [...inputs].map(inp => inp.value).join("");

    if (code.length < 5) {
        result.style.color = "red";
        result.textContent = "Preencha todos os dígitos.";
        return;
    }

    // AQUI você compara com o código do banco
    console.log("Código digitado:", code);

    result.style.color = "green";
    result.textContent = "Código enviado: " + code;
});
