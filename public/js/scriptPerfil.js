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
        const emailAdmin = localStorage.getItem("emailadmin");
        const emailUsuario = localStorage.getItem("emailUsuario");

        let tipo = "Aluno";
        let url;

        if (emailAdmin) {
            tipo = "Admin";
            url = `http://localhost:3000/admins/email/${emailAdmin}`;
        } else if (emailUsuario) {
            tipo = "Aluno";
            url = `http://localhost:3000/usuarios/email/${emailUsuario}`;
        } else {
            console.error("Email não encontrado no localStorage. Faça login novamente.");
            return;
        }

        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro na resposta:", errorData);
            throw new Error("Erro ao buscar dados do usuário");
        }

        const usuario = await response.json();
        console.log("Dados recebidos:", usuario, "tipo:", tipo);

        // Preenche os dados no HTML
        document.getElementById("nome-usuario").textContent = usuario.nome || "N/A";
        document.getElementById("email-usuario").textContent = usuario.email || "N/A";

        // Admins não possuem curso ou data_nascimento na tabela; ajusta exibição
        if (tipo === "Admin") {
            document.getElementById("perfil-usuario").textContent = "Admin";
            document.getElementById("criado-em-usuario").textContent = formatarData(usuario.criado_em);
        } else {
            document.getElementById("curso-usuario").textContent = usuario.curso || "N/A";
            document.getElementById("perfil-usuario").textContent = usuario.perfil || "Aluno";
            document.getElementById("data-nascimento-usuario").textContent = formatarData(usuario.data_nascimento);
            document.getElementById("criado-em-usuario").textContent = formatarData(usuario.criado_em);
        }

            // Esconder elementos que não devem aparecer na tela
            // Esconder curso e data de nascimento (manter apenas nome, email, perfil e criado em)
            const cursoElem = document.getElementById("curso-usuario");
            if (cursoElem) {
                const cursoContainer = cursoElem.closest('.info');
                if (cursoContainer) cursoContainer.style.display = 'none';
            }

            const dataNascElem = document.getElementById("data-nascimento-usuario");
            if (dataNascElem) {
                const dataContainer = dataNascElem.closest('.info');
                if (dataContainer) dataContainer.style.display = 'none';
            }

            // Esconder interesses (select), link 'Veja suas conquistas' e toda a seção de progresso
            const interessesSelect = document.getElementById('categoriaPreferida');
            if (interessesSelect) {
                const interessesContainer = interessesSelect.closest('.info');
                if (interessesContainer) interessesContainer.style.display = 'none';
            }

            const vejaConquistas = document.querySelector('.veja-conquistas');
            if (vejaConquistas) vejaConquistas.style.display = 'none';

            const progresso = document.querySelector('.progresso-container');
            if (progresso) progresso.style.display = 'none';

    } catch (erro) {
        console.error("Erro ao carregar dados do usuário:", erro);
    }
}

// Carrega os dados quando a página é carregada
document.addEventListener("DOMContentLoaded", () => {
    carregarDadosUsuario();
});

document.getElementById("btnSair").addEventListener("click", () => {
    if (localStorage.getItem("emailadmin")) {
        localStorage.removeItem("emailadmin");
    }
    if (localStorage.getItem("emailUsuario")) {
        localStorage.removeItem("emailUsuario");
    }
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

