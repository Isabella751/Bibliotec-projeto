// Formata data
function formatarData(dataISO) {
    if (!dataISO) return "N/A";
    return new Date(dataISO).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

// Busca dados do admin
async function carregarDadosadmin() {
    try {
        const emailadmin = localStorage.getItem("emailadmin");

        if (!emailadmin) {
            console.error("Nenhum emailadmin encontrado. Usuário não é admin.");
            return;
        }

        console.log("Buscando admin:", emailadmin);

        const response = await fetch(`http://localhost:3000/email/${emailadmin}`);

        if (!response.ok) {
            console.error("Erro ao buscar admin:", await response.json());
            return;
        }

        const admin = await response.json();
        console.log("Dados do admin recebidos:", admin);

        // Garante que os elementos existem antes de preencher
        document.getElementById("nome-admin")?.textContent = admin.nome || "N/A";
        document.getElementById("email-admin")?.textContent = admin.email || "N/A";
        document.getElementById("perfil-admin")?.textContent = "Admin";
        document.getElementById("criado-em-admin")?.textContent = formatarData(admin.criado_em);

    } catch (e) {
        console.error("Erro ao carregar admin:", e);
    }
}

// Executa ao carregar página
document.addEventListener("DOMContentLoaded", () => {
    const btnSair = document.getElementById("btnSair");
    if (btnSair) {
        btnSair.addEventListener("click", () => {
            localStorage.removeItem("emailadmin");
            window.location.href = "bibliotec.html";
        });
    }

    carregarDadosadmin();
});
