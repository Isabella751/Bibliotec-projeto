// Função para buscar dados do usuário no banco
async function carregarDadosUsuario() {
    try {
        // Recupera o email do usuário do localStorage (salvo durante login)
        const emailUsuario = localStorage.getItem("emailUsuario");
        
        console.log("Email recuperado do localStorage:", emailUsuario);
        
        if (!emailUsuario) {
            console.error("Email não encontrado no localStorage. Faça login novamente.");
            return;
        }

        // Faz requisição para obter dados do usuário (corrigido o endpoint)
        const url = `http://localhost:3000/usuarios/email/${emailUsuario}`;
        console.log("Fazendo fetch para:", url);
        
        const response = await fetch(url);
        
        console.log("Status da resposta:", response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro na resposta:", errorData);
            throw new Error("Erro ao buscar dados do usuário");
        }

        const usuario = await response.json();
        console.log("Dados do usuário recebidos:", usuario);

        // Preenche os dados no HTML
        document.getElementById("nome-usuario").textContent = usuario.nome || "N/A";
        document.getElementById("email-usuario").textContent = usuario.email || "N/A";
        document.getElementById("curso-usuario").textContent = usuario.curso || "N/A";
        document.getElementById("criado-em-usuario").textContent = usuario.criado_em || "N/A";
        
        document.getElementById("perfil-usuario").textContent = "Aluno"; // Tipo fixo por enquanto

        console.log("Dados preenchidos com sucesso!");

    } catch (erro) {
        console.error("Erro ao carregar dados do usuário:", erro);
        // Mantém valores padrão se houver erro
    }
}

// Carrega os dados quando a página é carregada
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM carregado, iniciando carregamento de dados...");
    carregarDadosUsuario();
});

document.getElementById("btnSair").addEventListener("click", () => {
    // Limpa dados do localStorage ao sair
    localStorage.removeItem("emailUsuario");
    window.location.href = "bibliotec.html";
});
