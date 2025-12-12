// ============================
// CONFIGURAÇÃO DA API
// ============================
// Ajuste aqui se sua rota backend for diferente (ex: sem /api)
const BASE_URL = 'http://localhost:3000'; 
const API_URL = `${BASE_URL}/livros`; 
const API_DESTAQUES = `${BASE_URL}/livros/destaques`; 
const API_BUSCA = `${BASE_URL}/livros/busca`;

// Cores alternadas para os corações
const coresCoracao = ['coracaoVazioAzul.png', 'coracaoVazioVerde.png'];

// Controle de estado
let modoDestaque = true; 

// ============================
// 1. SCROLL DO HEADER & ÍCONES
// ============================
window.addEventListener("scroll", function () {
    const header = document.querySelector(".main-header");
    const leftIcons = document.querySelector(".left-icons");
    const rightIcons = document.querySelector(".right-icons");
    const categoryBox = document.querySelector(".category-box");
    const lineRight = document.querySelector(".linha-right");

    // Efeito no Header
    if (window.scrollY > 10) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

    // Esconder laterais
    if (window.scrollY > 50) {
        if(leftIcons) leftIcons.classList.add("hide-left");
        if(rightIcons) rightIcons.classList.add("hide-right");
        if(categoryBox) categoryBox.classList.add("hide-category");
        if(lineRight) lineRight.classList.add("hide-line");
    } else {
        if(leftIcons) leftIcons.classList.remove("hide-left");
        if(rightIcons) rightIcons.classList.remove("hide-right");
        if(categoryBox) categoryBox.classList.remove("hide-category");
        if(lineRight) lineRight.classList.remove("hide-line");
    }
});

// ============================
// 2. CARREGAR DESTAQUES (INÍCIO)
// ============================
async function carregarDestaques() {
    try {
        modoDestaque = true;
        const response = await fetch(`${API_DESTAQUES}?limite=24`);
        
        if (!response.ok) throw new Error('Erro ao buscar destaques');
        
        const livros = await response.json();
        
        atualizarTitulo('Livros em Destaque');
        exibirLivros(livros);
        
    } catch (erro) {
        console.error('Erro ao carregar destaques:', erro);
        mostrarErro('Não foi possível carregar os destaques.');
    }
}

// ============================
// 3. BUSCA DE LIVROS (INTEGRADO COM BACKEND)
// ============================
async function buscarLivros(termoBusca) {
    try {
        modoDestaque = false;
        // Chama a rota de busca do Backend (Título, Autor ou Gênero)
        const response = await fetch(`${API_BUSCA}?q=${termoBusca}`);
        
        if (!response.ok) throw new Error('Erro na busca');

        const livrosEncontrados = await response.json();
        
        atualizarTitulo(`Resultados para: "${termoBusca}"`);
        exibirLivros(livrosEncontrados);
        
    } catch (erro) {
        console.error('Erro na busca:', erro);
        mostrarErro('Erro ao realizar a busca.');
    }
}

// ============================
// 4. FILTRO POR CATEGORIA (VIA JS OU BACKEND)
// ============================
// Nota: Se quiser filtrar via Backend no futuro, crie uma rota /livros/categoria/:genero
async function filtrarPorCategoria(genero) {
    try {
        modoDestaque = false;
        
        // Como ainda não temos rota específica de categoria no backend, 
        // vamos buscar na busca geral (pelo Genero)
        const response = await fetch(`${API_BUSCA}?q=${genero}`);
        const livros = await response.json();
        
        // Filtra exato caso a busca traga coisas parecidas
        const livrosFiltrados = livros.filter(l => 
            l.genero && l.genero.toLowerCase().includes(genero.toLowerCase())
        );

        atualizarTitulo(`Categoria: ${genero}`);
        exibirLivros(livrosFiltrados);
        
    } catch (erro) {
        console.error('Erro ao filtrar categoria:', erro);
        mostrarErro('Erro ao carregar categoria.');
    }
}

// ============================
// 5. EXIBIR LIVROS (RENDERIZAÇÃO)
// ============================
function exibirLivros(livros) {
    const container = document.getElementById('livros');
    container.innerHTML = '';
    
    if (!livros || livros.length === 0) {
        container.innerHTML = '<p class="sem-livros" style="color:white; padding:20px;">Nenhum livro encontrado.</p>';
        return;
    }
    
    livros.forEach((livro, index) => {
        const livroCard = criarCardLivro(livro, index);
        container.appendChild(livroCard);
    });
    
    inicializarCoracoes();
}

function criarCardLivro(livro, index) {
    const div = document.createElement('div');
    // Mantendo sua classe para não quebrar o CSS
    div.className = `livro_${index + 1}`; 
    // Se passar de 4 ou 5 livros, pode ser que seu CSS precise de ajuste ou use uma classe genérica "card-livro"
    
    // Fallback de imagem
    const caminhoCapa = (livro.caminho_capa && livro.caminho_capa.length > 5) 
        ? livro.caminho_capa 
        : './images/placeholder.png'; // Garanta que essa imagem existe ou use uma URL externa
    
    const corCoracao = coresCoracao[index % 2];
    
    // Badge de visualizações (opcional)
    const badge = livro.visualizacoes > 0 
        ? `<div style="position:absolute; top:5px; right:5px; background:rgba(0,0,0,0.7); color:white; padding:2px 5px; border-radius:4px; font-size:10px;">${livro.visualizacoes} 👁️</div>` 
        : '';

    div.style.position = "relative"; // Para o badge funcionar

    div.innerHTML = `
        ${badge}
        <img class="capa${index + 1}" 
             src="${caminhoCapa}" 
             alt="${livro.titulo}"
             title="${livro.titulo} - ${livro.autor}"
             style="cursor: pointer; width: 100%; height: auto; border-radius: 5px;">
             
        <img class="fav" 
             src="./images/${corCoracao}" 
             alt="favorito"
             data-livro-id="${livro.id}"
             style="cursor: pointer; position: absolute; bottom: 10px; right: 10px;">
             
        <div style="color: white; font-size: 12px; margin-top: 5px; text-align: center;">
            ${livro.titulo.substring(0, 20)}${livro.titulo.length > 20 ? '...' : ''}
        </div>
    `;
    
    // Clique na capa
    const imgCapa = div.querySelector(`.capa${index + 1}`);
    imgCapa.addEventListener('click', () => {
        registrarVisualizacao(livro.id);
        abrirDetalhesLivro(livro); 
    });
    
    return div;
}

// ============================
// 6. FUNÇÕES AUXILIARES
// ============================

function abrirDetalhesLivro(livro) {
    // 1. Preencher os dados no HTML
    document.getElementById("mTitulo").textContent = livro.titulo;
    document.getElementById("mAutor").textContent = livro.autor;
    document.getElementById("mGenero").textContent = livro.genero || "Não informado";
    document.getElementById("mAno").textContent = livro.ano_publicacao || "--";
    document.getElementById("mEditora").textContent = livro.editora || "--";
    document.getElementById("mIsbn").textContent = livro.isbn || "--";
    document.getElementById("mSinopse").textContent = livro.sinopse || "Sinopse não disponível.";
    
    // Imagem da capa
    const imgModal = document.getElementById("mCapa");
    imgModal.src = (livro.caminho_capa && livro.caminho_capa.length > 5) 
        ? livro.caminho_capa 
        : "./images/placeholder.png";

    // Status
    const statusBadge = document.getElementById("mStatus");
    if (statusBadge) { // Verificação de segurança caso o elemento não exista
        if (livro.ativo == 1) {
            statusBadge.textContent = "Disponível";
            statusBadge.style.backgroundColor = "#27ae60";
        } else {
            statusBadge.textContent = "Indisponível";
            statusBadge.style.backgroundColor = "#e74c3c";
        }
    }

    // 2. Mostrar o Modal
    const modal = document.getElementById("modalLivro");
    modal.style.display = "flex";

    // 3. Configurar botão de fechar
    const btnFechar = document.querySelector(".fechar-modal");
    if (btnFechar) {
        btnFechar.onclick = () => { modal.style.display = "none"; };
    }

    // 4. Fechar ao clicar fora
    window.onclick = (event) => {
        if (event.target == modal) { modal.style.display = "none"; }
    };
}

async function registrarVisualizacao(livroId) {
    try {
        await fetch(`${API_URL}/${livroId}/visualizar`, { method: 'POST' });
    } catch (erro) { console.error(erro); }
}

function atualizarTitulo(texto) {
    const titulo = document.querySelector('.h2_degrade');
    if (titulo) titulo.textContent = texto;
}

function mostrarErro(mensagem) {
    const container = document.getElementById('livros');
    container.innerHTML = `<div style="color:white; text-align:center; padding:20px;">${mensagem} <br> <button onclick="carregarDestaques()">Voltar</button></div>`;
}

function inicializarCoracoes() {
    document.querySelectorAll(".fav").forEach(fav => {
        fav.addEventListener("click", (e) => {
            e.stopPropagation();
            // Lógica simples de troca de imagem
            const isBlue = fav.src.includes("Azul");
            if (fav.src.includes("Vazio")) {
                fav.src = isBlue ? "./images/coracaoPreenchidoAzul.png" : "./images/coracaoPreenchidoVerde.png";
            } else {
                fav.src = isBlue ? "./images/coracaoVazioAzul.png" : "./images/coracaoVazioVerde.png";
            }
        });
    });
}

// ============================
// 7. INICIALIZAÇÃO E EVENTOS
// ============================
document.addEventListener("DOMContentLoaded", () => {
    
    // A. Verifica se já veio uma busca pela URL (ex: inicio.html?busca=vidas)
    const params = new URLSearchParams(window.location.search);
    const termoURL = params.get("busca");

    if (termoURL && termoURL.trim() !== "") {
        // Se tem busca na URL, preenche o campo e busca direto
        const inputBusca = document.getElementById("busca");
        if (inputBusca) inputBusca.value = termoURL;
        buscarLivros(termoURL);
    } else {
        // Se não tem busca, carrega os destaques normais
        carregarDestaques();
    }
    
    // B. Configura Menu de Categorias
    const catHeader = document.querySelector('.category-header');
    const catBox = document.querySelector('.category-box');
    if (catHeader && catBox) {
        catHeader.addEventListener('click', () => catBox.classList.toggle('open'));
    }

    // C. Configura Clique nas Categorias
    document.querySelectorAll('.category-list p').forEach(p => {
        p.addEventListener('click', () => {
            filtrarPorCategoria(p.textContent.trim());
            if(catBox) catBox.classList.remove('open');
        });
    });
    
    // D. Configura o Formulário de Busca (Para não recarregar a página na próxima vez)
    const formBusca = document.querySelector(".busca");
    const inputBusca = document.getElementById("busca");

    if (formBusca) {
        formBusca.addEventListener('submit', (e) => {
            e.preventDefault(); // <--- ISSO IMPEDE A TELA DE PISCAR/RECARREGAR
            const termo = inputBusca.value.trim();
            if (termo) {
                // Atualiza a URL sem recarregar a página (opcional, mas fica bonito)
                window.history.pushState({}, "", `?busca=${termo}`);
                buscarLivros(termo);
            } else {
                carregarDestaques();
            }
        });
    }
    
    // E. Busca enquanto digita (Opcional)
    if (inputBusca) {
        let timeout;
        inputBusca.addEventListener("input", (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const termo = e.target.value.trim();
                if (termo.length >= 3) {
                    buscarLivros(termo);
                } else if (termo.length === 0) {
                    carregarDestaques();
                }
            }, 800); // Espera um pouco antes de buscar
        });
    }
});