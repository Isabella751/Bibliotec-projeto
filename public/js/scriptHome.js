// ============================
// CONFIGURAÇÃO DA API
// ============================
const BASE_URL = 'http://localhost:3000'; 
const API_URL = `${BASE_URL}/livros`; 
const API_DESTAQUES = `${BASE_URL}/livros/destaques`; 
const API_BUSCA = `${BASE_URL}/livros/busca`;
const API_RESERVAS = `${BASE_URL}/reservas`; 
const API_FAVORITOS = `${BASE_URL}/favoritos`;


// ============================
// FUNÇÕES AUXILIARES
// ============================
function atualizarTitulo(texto) {
    const titulo = document.querySelector('.h2_degrade');
    if (titulo) titulo.textContent = texto;
}

function mostrarErro(mensagem) {
    const container = document.getElementById('livros');
    container.innerHTML = `<div style="color:white; text-align:center; padding:20px;">${mensagem} <br> <button onclick="carregarDestaques()">Voltar</button></div>`;
}

// ============================
// FUNÇÃO PARA CRIAR O CARD DO LIVRO
// ============================
function criarCardLivro(livro, index) {
    const div = document.createElement('div');
    div.className = `livro`; 
    
    const caminhoCapa = (livro.caminho_capa && livro.caminho_capa.length > 5) 
        ? livro.caminho_capa 
        : './images/placeholder.png'; 
    
    // BADGE DE STATUS PARA LIVROS INDISPONÍVEIS (SE ATIVO=0)
    let badgeStatus = '';
    if (livro.ativo == 0) {
        badgeStatus = `<div style="position:absolute; top:5px; left:5px; background:rgb(204, 0, 0); color:white; padding:2px 5px; border-radius:4px; font-size:10px; z-index: 10;">INDISPONÍVEL</div>`;
    }
    
    const badgeVisualizacoes = livro.visualizacoes > 0 
        ? `<div style="position:absolute; top:5px; right:5px; background:rgba(0,0,0,0.7); color:white; padding:2px 5px; border-radius:4px; font-size:10px; z-index: 10;">${livro.visualizacoes} 👁️</div>` 
        : ''; 

    div.style.position = "relative"; 

    div.innerHTML = `
        <div class="capa-container"> 
            ${badgeVisualizacoes}
            ${badgeStatus}
            <img class="capa${index + 1}" 
                  src="${caminhoCapa}" 
                  alt="${livro.titulo}"
                  title="${livro.titulo} - ${livro.autor}"
                  style="cursor: pointer; width: 100%; height: 100%; border-radius: 5px;">
        </div>

        <div style="color: black; font-size: 12px; text-align: center; margin-top: 5px;">
            ${livro.titulo.substring(0, 20)}${livro.titulo.length > 20 ? '...' : ''}
        </div>
    `;
    
    const imgCapa = div.querySelector(`.capa${index + 1}`);
    imgCapa.addEventListener('click', () => {
        registrarVisualizacao(livro.id); 
        abrirDetalhesLivro(livro); 
    });
    
    return div;
}

// ============================
// 3. CARREGAR DESTAQUES E CATÁLOGO
// ============================
async function carregarDestaques() {
    try {
        const response = await fetch(`${API_URL}?limite=100`); 
        if (!response.ok) throw new Error('Erro ao buscar destaques');
        const todosLivros = await response.json();
        
        console.log('📚 Total de livros recebidos:', todosLivros.length); // DEBUG
        console.log('📊 Dados dos livros:', todosLivros); // DEBUG
        
        // Separa por visualizações
        const livrosDestaque = todosLivros.filter(livro => (livro.visualizacoes || 0) >= 10);
        const livrosCatalogo = todosLivros.filter(livro => (livro.visualizacoes || 0) < 10);
        
        console.log('⭐ Livros em Destaque (10+):', livrosDestaque.length); // DEBUG
        console.log('📖 Livros no Catálogo (<10):', livrosCatalogo.length); // DEBUG
        
        // Exibe DESTAQUE
        const containerDestaque = document.getElementById('livros');
        if (containerDestaque) {
            atualizarTitulo('Livros em Destaque');
            containerDestaque.innerHTML = '';
            
            if (livrosDestaque.length === 0) {
                containerDestaque.innerHTML = '<p style="color:white; padding:20px;">Nenhum livro em destaque ainda.</p>';
            } else {
                livrosDestaque.forEach((livro, index) => {
                    const livroCard = criarCardLivro(livro, index);
                    containerDestaque.appendChild(livroCard);
                });
            }
        }
        
        // Exibe CATÁLOGO
        exibirCatalogo(livrosCatalogo);
        
    } catch (erro) {
        console.error('❌ Erro ao carregar destaques:', erro);
        mostrarErro('Não foi possível carregar os destaques.');
    }
}

// ============================
// FUNÇÃO PARA EXIBIR CATÁLOGO
// ============================
function exibirCatalogo(livros) {
    // Remove catálogo antigo se existir
    let catalogoSection = document.getElementById('catalogoSection');
    if (catalogoSection) {
        catalogoSection.remove();
    }
    
    if (!livros || livros.length === 0) {
        console.log('⚠️ Nenhum livro para o catálogo');
        return;
    }
    
    // Cria nova seção de catálogo
    catalogoSection = document.createElement('div');
    catalogoSection.id = 'catalogoSection';
    catalogoSection.innerHTML = `
        <div style="margin-top: 50px;">
            <h2 class="h2_degrade">Catálogo</h2>
        </div>
        <div id="livrosCatalogo" style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 1.5vw;
            padding: 0 2vw;
            width: 100%;
            max-width: 100%;
        "></div>
    `;
    
    // Insere após a seção de destaques
    const faceDestaques = document.querySelector('.faceDestaques');
    if (faceDestaques && faceDestaques.parentNode) {
        faceDestaques.parentNode.insertBefore(catalogoSection, faceDestaques.nextSibling);
    }
    
    // Adiciona os livros
    const containerCatalogo = document.getElementById('livrosCatalogo');
    if (containerCatalogo) {
        livros.forEach((livro, index) => {
            const livroCard = criarCardLivro(livro, index + 1000);
            containerCatalogo.appendChild(livroCard);
        });
    }
    
    console.log('✅ Catálogo renderizado com', livros.length, 'livros');
}

// ============================
// 4. BUSCA DE LIVROS (ATUALIZADA)
// ============================
async function buscarLivros(termoBusca) {
    try {
        const response = await fetch(`${API_BUSCA}?q=${termoBusca}`);
        if (!response.ok) throw new Error('Erro na busca');
        const livrosEncontrados = await response.json();
        
        atualizarTitulo(`Resultados para: "${termoBusca}"`);
        
        // Na busca, mostra tudo junto (sem separar)
        exibirLivrosDestaque(livrosEncontrados);
        
        // Esconde o catálogo durante a busca
        const catalogoSection = document.getElementById('catalogoSection');
        if (catalogoSection) catalogoSection.style.display = 'none';
        
    } catch (erro) {
        console.error('Erro na busca:', erro);
        mostrarErro('Erro ao realizar a busca.');
    }
}

// ============================
// 5. FILTRO POR CATEGORIA (ATUALIZADO)
// ============================
async function filtrarPorCategoria(genero) {
    try {
        const response = await fetch(`${API_BUSCA}?q=${genero}`);
        const livros = await response.json();
        const livrosFiltrados = livros.filter(l => 
            l.genero && l.genero.toLowerCase().includes(genero.toLowerCase())
        );
        
        atualizarTitulo(`Categoria: ${genero}`);
        exibirLivrosDestaque(livrosFiltrados);
        
        // Esconde o catálogo durante o filtro
        const catalogoSection = document.getElementById('catalogoSection');
        if (catalogoSection) catalogoSection.style.display = 'none';
        
    } catch (erro) {
        console.error('Erro ao filtrar categoria:', erro);
        mostrarErro('Erro ao carregar categoria.');
    }
}

// ============================
// Inicialização (MODIFICADA)
// ============================
document.addEventListener("DOMContentLoaded", () => {
    
    const params = new URLSearchParams(window.location.search);
    const termoURL = params.get("busca");

    if (termoURL && termoURL.trim() !== "") {
        const inputBusca = document.getElementById("busca");
        if (inputBusca) inputBusca.value = termoURL;
        buscarLivros(termoURL);
    } else {
        // ✅ CHAMA A NOVA FUNÇÃO
        carregarDestaques();
    }
    
    const catHeader = document.querySelector('.category-header');
    const catBox = document.querySelector('.category-box');
    if (catHeader && catBox) {
        catHeader.addEventListener('click', () => catBox.classList.toggle('open'));
    }

    document.querySelectorAll('.category-list p').forEach(p => {
        p.addEventListener('click', () => {
            filtrarPorCategoria(p.textContent.trim());
            if(catBox) catBox.classList.remove('open');
        });
    });
    
    const formBusca = document.querySelector(".busca");
    const inputBusca = document.getElementById("busca");

    if (formBusca) {
        formBusca.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const termo = inputBusca.value.trim();
            if (termo) {
                window.history.pushState({}, "", `?busca=${termo}`);
                buscarLivros(termo);
            } else {
                carregarDestaques(); // ✅ MODIFICADO
            }
        });
    }
    
    if (inputBusca) {
        let timeout;
        inputBusca.addEventListener("input", (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const termo = e.target.value.trim();
                if (termo.length >= 3) {
                    buscarLivros(termo);
                } else if (termo.length === 0) {
                    carregarDestaques(); // ✅ MODIFICADO
                }
            }, 500); 
        });
    }
});