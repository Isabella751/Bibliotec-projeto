// Função para formatar datas ISO em DD/MM/YYYY
function formatarData(dataISO) {
    if (!dataISO) return "N/A";

    const data = new Date(dataISO);

    // Garante que sempre vai exibir DD/MM/YYYY corretamente
    return data.toLocaleDateString("pt-BR", {
        timeZone: "UTC"
    });
}

// Função para buscar dados do usuário no banco
async function carregarDadosUsuario() {
    try {
        const emailUsuario = localStorage.getItem("emailUsuario");

        if (!emailUsuario) {
            console.error("Email não encontrado no localStorage. Faça login novamente.");
            return;
        }

        const url = `http://localhost:3000/usuarios/email/${emailUsuario}`;
        const response = await fetch(url);

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
        document.getElementById("perfil-usuario").textContent = usuario.perfil || "Aluno";

        // >>> AQUI as datas formatadinhas <<<
        document.getElementById("data-nascimento-usuario").textContent =
            formatarData(usuario.data_nascimento);

        document.getElementById("criado-em-usuario").textContent =
            formatarData(usuario.criado_em);

        console.log("Dados preenchidos com sucesso!");

    } catch (erro) {
        console.error("Erro ao carregar dados do usuário:", erro);
    }
}

// Carrega os dados quando a página é carregada
document.addEventListener("DOMContentLoaded", () => {
    carregarDadosUsuario();
});

document.getElementById("btnSair").addEventListener("click", () => {
    localStorage.removeItem("emailUsuario");
    window.location.href = "bibliotec.html";
});

const lidos = 19;
const meta = 20;

const porcentagem = (lidos / meta) * 100;

document.getElementById("textoProgresso").textContent =
  `Você leu ${lidos} de ${meta} livros este ano`;

document.getElementById("barraProgresso").style.width = `${porcentagem}%`;

const selectCat = document.getElementById("categoriaFav");

selectCat.addEventListener("change", () => {
    const valor = selectCat.value;
    localStorage.setItem("categoriaFavorita", valor);
});

// Carregar escolha salva
window.addEventListener("load", () => {
    const salvo = localStorage.getItem("categoriaFavorita");
    if (salvo) selectCat.value = salvo;
});

