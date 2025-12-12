// ============================
// CONFIGURAÇÃO DA API
// ============================
const API_URL = 'http://localhost:3000/api/livros'; // AJUSTE A PORTA SE NECESSÁRIO
const API_DESTAQUES = 'http://localhost:3000/api/livros/destaques'; // Nova rota

// Cores alternadas para os corações (azul e verde)
const coresCoracao = ['coracaoVazioAzul.png', 'coracaoVazioVerde.png'];

// Controle de estado
let modoDestaque = true; // Inicia mostrando apenas destaques

// ============================
// SCROLL DO HEADER
// ============================
window.addEventListener("scroll", function () {
    const header = document.querySelector(".main-header");

    if (window.scrollY > 10) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// ============================
// SCROLL - ESCONDER ÍCONES LATERAIS
// ============================
window.addEventListener("scroll", () => {
    const leftIcons = document.querySelector(".left-icons");
    const rightIcons = document.querySelector(".right-icons");
    const categoryBox = document.querySelector(".category-box");
    const lineRight = document.querySelector(".linha-right");

    if (window.scrollY > 50) {
        leftIcons.classList.add("hide-left");
        rightIcons.classList.add("hide-right");
        categoryBox.classList.add("hide-category");
        lineRight.classList.add("hide-line");
    } else {
        leftIcons.classList.remove("hide-left");
        rightIcons.classList.remove("hide-right");
        categoryBox.classList.remove("hide-category");
        lineRight.classList.remove("hide-line");
    }
});

// ============================
// CARREGAR LIVROS EM DESTAQUE
// ============================
async function carregarDestaques() {
    try {
        modoDestaque = true;
        const response = await fetch(`${API_DESTAQUES}?limite=24`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar destaques');
        }
        
        const livros = await response.json();
        
        // Atualizar título para indicar que são destaques
        const tituloDestaques = document.querySelector('.h2_degrade');
        if (tituloDestaques) {
            tituloDestaques.textContent = 'Livros em Destaque';
        }
        
        exibirLivros(livros);
        
    } catch (erro) {
        console.error('Erro ao carregar destaques:', erro);
        mostrarErro('Não foi possível carregar os destaques. Tente novamente mais tarde.');
    }
}

// ============================
// CARREGAR TODOS OS LIVROS
// ============================
async function carregarTodosLivros() {
    try {
        modoDestaque = false;
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar livros da API');
        }
        
        const livros = await response.json();
        
        // Atualizar título
        const tituloDestaques = document.querySelector('.h2_degrade');
        if (tituloDestaques) {
            tituloDestaques.textContent = 'Todos os Livros';
        }
        
        exibirLivros(livros);
        
    } catch (erro) {
        console.error('Erro ao carregar livros:', erro);
        mostrarErro('Não foi possível carregar os livros. Tente novamente mais tarde.');
    }
}

// ============================
// REGISTRAR VISUALIZAÇÃO DO LIVRO
// ============================
async function registrarVisualizacao(livroId) {
    try {
        await fetch(`${API_URL}/${livroId}/visualizar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(`Visualização registrada para livro ID: ${livroId}`);
    } catch (erro) {
        console.error('Erro ao registrar visualização:', erro);
        // Não mostra erro ao usuário, apenas registra no console
    }
}

// ============================
// EXIBIR LIVROS NA TELA
// ============================
function exibirLivros(livros) {
    const container = document.getElementById('livros');
    
    // Limpar conteúdo anterior
    container.innerHTML = '';
    
    // Verificar se há livros
    if (!livros || livros.length === 0) {
        container.innerHTML = '<p class="sem-livros">Nenhum livro disponível no momento.</p>';
        return;
    }
    
    // Criar card para cada livro
    livros.forEach((livro, index) => {
        const livroCard = criarCardLivro(livro, index);
        container.appendChild(livroCard);
    });
    
    // Após criar os livros, adicionar eventos nos corações
    inicializarCoracoes();
}

// ============================
// CRIAR CARD DE LIVRO
// ============================
function criarCardLivro(livro, index) {
    const div = document.createElement('div');
    div.className = `livro_${index + 1}`;
    
    // Definir caminho da capa (usar a do banco ou placeholder)
    const caminhoCapa = livro.caminho_capa || './book_images/placeholder.jpg';
    
    // Alternar entre coração azul e verde
    const corCoracao = coresCoracao[index % 2];
    
    // Badge de popularidade (opcional - mostra quantas visualizações)
    const badgeVisualizacoes = livro.visualizacoes > 0 
        ? `<span class="badge-views" title="Visualizações">${livro.visualizacoes} 👁️</span>` 
        : '';
    
    div.innerHTML = `
        ${badgeVisualizacoes}
        <img class="capa${index + 1}" 
             src="${caminhoCapa}" 
             alt="${livro.titulo}"
             title="${livro.titulo} - ${livro.autor}"
             style="cursor: pointer;">
        <img class="fav" 
             src="./images/${corCoracao}" 
             alt="favorito"
             data-livro-id="${livro.id}"
             style="cursor: pointer;">
    `;
    
    // Adicionar evento de clique na capa - REGISTRA VISUALIZAÇÃO
    const imgCapa = div.querySelector(`img.capa${index + 1}`);
    imgCapa.addEventListener('click', () => {
        registrarVisualizacao(livro.id); // ← REGISTRA A VISUALIZAÇÃO!
        abrirDetalhesLivro(livro);
    });
    
    return div;
}

// ============================
// ABRIR DETALHES DO LIVRO
// ============================
function abrirDetalhesLivro(livro) {
    const detalhes = `
Título: ${livro.titulo}
Autor: ${livro.autor}
Gênero: ${livro.genero || 'Não informado'}
Ano: ${livro.ano_publicacao || 'Não informado'}
Visualizações: ${livro.visualizacoes || 0}
${livro.sinopse ? '\nSinopse: ' + livro.sinopse : ''}
    `;
    alert(detalhes.trim());
    
    // Ou redirecionar para página de detalhes:
    // window.location.href = `detalhes.html?id=${livro.id}`;
}

// ============================
// CORAÇÕES — FAVORITAR LIVROS
// ============================
function inicializarCoracoes() {
    const favIcons = document.querySelectorAll(".fav");

    favIcons.forEach(fav => {
        fav.addEventListener("click", (e) => {
            e.stopPropagation();

            const srcAtual = fav.src;
            let vazio, cheio, cor;

            if (srcAtual.includes("VazioAzul") || srcAtual.includes("PreenchidoAzul")) {
                vazio = "./images/coracaoVazioAzul.png";
                cheio = "./images/coracaoPreenchidoAzul.png";
                cor = "azul";
            } else if (srcAtual.includes("VazioVerde") || srcAtual.includes("PreenchidoVerde")) {
                vazio = "./images/coracaoVazioVerde.png";
                cheio = "./images/coracaoPreenchidoVerde.png";
                cor = "verde";
            } else {
                vazio = "./images/coracaoVazioAzul.png";
                cheio = "./images/coracaoPreenchidoAzul.png";
                cor = "azul";
            }

            if (fav.classList.contains("active")) {
                fav.src = vazio;
                fav.classList.remove("active");
            } else {
                fav.src = cheio;
                fav.classList.add("active");
            }

            const livroId = fav.getAttribute('data-livro-id');
            console.log(`Livro ID ${livroId} - Coração ${cor} alternado para:`, fav.classList.contains("active") ? "cheio" : "vazio");
        });
    });
}

// ============================
// MOSTRAR ERRO
// ============================
function mostrarErro(mensagem) {
    const container = document.getElementById('livros');
    container.innerHTML = `
        <div class="erro-livros">
            <p>${mensagem}</p>
            <button onclick="carregarDestaques()">Tentar Novamente</button>
        </div>
    `;
}

// ============================
// BUSCA DE LIVROS
// ============================
async function buscarLivros(termoBusca) {
    try {
        modoDestaque = false; // Sai do modo destaque ao buscar
        
        const response = await fetch(API_URL);
        const todosLivros = await response.json();
        
        // Filtrar livros pelo termo de busca
        const livrosFiltrados = todosLivros.filter(livro => {
            const termo = termoBusca.toLowerCase();
            return livro.titulo.toLowerCase().includes(termo) ||
                   livro.autor.toLowerCase().includes(termo) ||
                   (livro.genero && livro.genero.toLowerCase().includes(termo));
        });
        
        // Atualizar título
        const tituloDestaques = document.querySelector('.h2_degrade');
        if (tituloDestaques) {
            tituloDestaques.textContent = `Resultados da busca: "${termoBusca}"`;
        }
        
        exibirLivros(livrosFiltrados);
        
    } catch (erro) {
        console.error('Erro na busca:', erro);
        mostrarErro('Erro ao realizar a busca.');
    }
}

// ============================
// FILTRO POR CATEGORIA
// ============================
async function filtrarPorCategoria(genero) {
    try {
        modoDestaque = false; // Sai do modo destaque ao filtrar
        
        const response = await fetch(API_URL);
        const todosLivros = await response.json();
        
        const livrosFiltrados = todosLivros.filter(livro => 
            livro.genero && livro.genero.toLowerCase() === genero.toLowerCase()
        );
        
        // Atualizar título
        const tituloDestaques = document.querySelector('.h2_degrade');
        if (tituloDestaques) {
            tituloDestaques.textContent = `Categoria: ${genero}`;
        }
        
        exibirLivros(livrosFiltrados);
        
    } catch (erro) {
        console.error('Erro ao filtrar por categoria:', erro);
        mostrarErro('Erro ao filtrar livros.');
    }
}

// ============================
// QUANDO A PÁGINA CARREGAR
// ============================
document.addEventListener("DOMContentLoaded", () => {
    
    // Carregar APENAS destaques inicialmente
    carregarDestaques();
    
    // Menu de categorias (abrir/fechar)
    const header = document.querySelector('.category-header');
    const box = document.querySelector('.category-box');

    if (header && box) {
        header.addEventListener('click', () => {
            box.classList.toggle('open');
        });
    }

    // Clique nas categorias para filtrar
    const itens = document.querySelectorAll('.category-list p');
    itens.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const genero = item.textContent.trim();
            filtrarPorCategoria(genero);
            box.classList.remove('open');
        });
    });
    
    // Campo de busca
    const campoBusca = document.getElementById('busca');
    if (campoBusca) {
        campoBusca.addEventListener('input', (e) => {
            const termo = e.target.value.trim();
            
            if (termo.length > 0) {
                buscarLivros(termo); // Busca em TODOS os livros
            } else {
                carregarDestaques(); // Volta para os destaques
            }
        });
    }
});