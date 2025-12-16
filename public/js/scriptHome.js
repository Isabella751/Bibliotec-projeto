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
// 1. FUNÇÃO PARA OBTER O ID DO USUÁRIO DINAMICAMENTE
// ============================
function obterUsuarioLogadoId() {
    const id = localStorage.getItem('userId');
    if (id) {
        return parseInt(id);
    }
    console.error("ID do usuário logado não encontrado! Faça o login.");
    return null;
}

// ============================
// 2. SCROLL DO HEADER & ÍCONES
// ============================
window.addEventListener("scroll", function () {
    const header = document.querySelector(".main-header");
    const leftIcons = document.querySelector(".left-icons");
    const rightIcons = document.querySelector(".right-icons");
    const categoryBox = document.querySelector(".category-box");
    const lineRight = document.querySelector(".linha-right");

    if (window.scrollY > 10) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

    if (window.scrollY > 50) {
        if (leftIcons) leftIcons.classList.add("hide-left");
        if (rightIcons) rightIcons.classList.add("hide-right");
        if (categoryBox) categoryBox.classList.add("hide-category");
        if (lineRight) lineRight.classList.add("hide-line");
    } else {
        if (leftIcons) leftIcons.classList.remove("hide-left");
        if (rightIcons) rightIcons.classList.remove("hide-right");
        if (categoryBox) categoryBox.classList.remove("hide-category");
        if (lineRight) lineRight.classList.remove("hide-line");
    }
});

// ============================
// 3. CARREGAR DESTAQUES E CATÁLOGO
// ============================
async function carregarDestaques() {
    try {
        const response = await fetch(`${API_URL}?limite=100`);
        if (!response.ok) throw new Error('Erro ao buscar destaques');
        const todosLivros = await response.json();
        
        console.log('📚 Total de livros recebidos:', todosLivros.length);
        console.log('📊 Dados dos livros:', todosLivros);
        
        // Separa por visualizações
        const livrosDestaque = todosLivros.filter(livro => (livro.visualizacoes || 0) >= 10);
        const livrosCatalogo = todosLivros.filter(livro => (livro.visualizacoes || 0) < 10);
        
        console.log('⭐ Livros em Destaque (10+):', livrosDestaque.length);
        console.log('📖 Livros no Catálogo (<10):', livrosCatalogo.length);
        
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
    let catalogoSection = document.getElementById('catalogoSection');
    if (catalogoSection) {
        catalogoSection.remove();
    }
    
    if (!livros || livros.length === 0) {
        console.log('⚠️ Nenhum livro para o catálogo');
        return;
    }
    
    catalogoSection = document.createElement('div');
    catalogoSection.id = 'catalogoSection';
    catalogoSection.innerHTML = `
        <div style="margin-top: 50px; margin-left: 0; width: 100%; text-align: center;">
            <h2 class="h2_degrade">Catálogo</h2>
        </div>
        <div id="livrosCatalogo"></div>
    `;
    
    const faceDestaques = document.querySelector('.faceDestaques');
    if (faceDestaques && faceDestaques.parentNode) {
        faceDestaques.parentNode.insertBefore(catalogoSection, faceDestaques.nextSibling);
    }
    
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
// 4. BUSCA DE LIVROS
// ============================
async function buscarLivros(termoBusca) {
    try {
        const response = await fetch(`${API_BUSCA}?q=${termoBusca}`);
        if (!response.ok) throw new Error('Erro na busca');
        const livrosEncontrados = await response.json();
        
        atualizarTitulo(`Resultados para: "${termoBusca}"`);
        exibirLivros(livrosEncontrados);
        
        const catalogoSection = document.getElementById('catalogoSection');
        if (catalogoSection) catalogoSection.style.display = 'none';
        
    } catch (erro) {
        console.error('Erro na busca:', erro);
        mostrarErro('Erro ao realizar a busca.');
    }
}

// ============================
// 5. FILTRO POR CATEGORIA
// ============================
async function filtrarPorCategoria(genero) {
    try {
        const response = await fetch(`${API_BUSCA}?q=${genero}`);
        const livros = await response.json();
        const livrosFiltrados = livros.filter(l =>
            l.genero && l.genero.toLowerCase().includes(genero.toLowerCase())
        );
        
        atualizarTitulo(`Categoria: ${genero}`);
        exibirLivros(livrosFiltrados);
        
        const catalogoSection = document.getElementById('catalogoSection');
        if (catalogoSection) catalogoSection.style.display = 'none';
        
    } catch (erro) {
        console.error('Erro ao filtrar categoria:', erro);
        mostrarErro('Erro ao carregar categoria.');
    }
}

// ============================
// 6. EXIBIR LIVROS (RENDERIZAÇÃO)
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
}

function criarCardLivro(livro, index) {
    const div = document.createElement('div');
    div.className = `card-livro livro_${index + 1}`;

    const caminhoCapa = (livro.caminho_capa && livro.caminho_capa.length > 5)
        ? livro.caminho_capa
        : './images/placeholder.png';

    // BADGES - Estilo original (posicionamento absoluto dentro da box-capa)
    let badgeStatus = '';
    if (livro.ativo == 0) {
        badgeStatus = `<div class="badge-status" style="position:absolute; top:5px; left:5px; background:#cc0000; color:white; padding:3px 8px; border-radius:4px; font-size:10px; font-weight:bold; z-index:10;">INDISPONÍVEL</div>`;
    }

    const badgeVisualizacoes = livro.visualizacoes > 0
        ? `<div class="badge-visu" style="position:absolute; top:5px; right:5px; background:rgba(0,0,0,0.7); color:white; padding:3px 8px; border-radius:4px; font-size:10px; z-index:10;">${livro.visualizacoes} 👁️</div>`
        : '';

    div.innerHTML = `
        <div class="box-capa" style="position:relative;"> 
            ${badgeVisualizacoes}
            ${badgeStatus}
            
            <img class="capa-img" 
                 src="${caminhoCapa}" 
                 alt="${livro.titulo}"
                 title="${livro.titulo} - ${livro.autor}"
                 style="cursor:pointer; width:100%; border-radius:5px;">
        </div>

        <div class="box-info" style="text-align:center; margin-top:8px;">
            <p class="titulo-livro" style="font-size:14px; font-weight:500; margin:0; color:#333;">${livro.titulo}</p>
        </div>
    `;

    const imgCapa = div.querySelector(`.capa-img`);
    imgCapa.addEventListener('click', () => {
        registrarVisualizacao(livro.id);
        abrirDetalhesLivro(livro);
    });

    return div;
}

// ============================
// 7. LÓGICA DE RESERVA E VALIDAÇÃO DE DATA
// ============================
function abrirDetalhesLivro(livro) {
    const modal = document.getElementById("modalLivro");
    const btnAbrirReserva = document.getElementById("btnAbrirReserva");
    const btnFavorito = document.getElementById("btnFavorito");
    const reservaFormContainer = document.getElementById("reservaFormContainer");
    const msgReserva = document.getElementById("msgReserva");
    const formReserva = document.getElementById("formReserva");

    // Reset de Estado
    if (formReserva) formReserva.reset();
    if (msgReserva) msgReserva.textContent = '';
    if (reservaFormContainer) reservaFormContainer.style.display = 'none';
    if (btnAbrirReserva) {
        btnAbrirReserva.textContent = 'Reservar Livro';
        btnAbrirReserva.disabled = false;
        btnAbrirReserva.style.display = 'block';
    }

    // Preencher os dados
    document.getElementById("mTitulo").textContent = livro.titulo;
    document.getElementById("mAutor").textContent = livro.autor;
    document.getElementById("mGenero").textContent = livro.genero || "Não informado";
    document.getElementById("mAno").textContent = livro.ano_publicacao || "--";
    document.getElementById("mEditora").textContent = livro.editora || "--";
    document.getElementById("mIsbn").textContent = livro.isbn || "--";
    document.getElementById("mSinopse").textContent = livro.sinopse || "Sinopse não disponível.";

    const imgModal = document.getElementById("mCapa");
    imgModal.src = (livro.caminho_capa && livro.caminho_capa.length > 5)
        ? livro.caminho_capa
        : "./images/placeholder.png";

    const statusBadge = document.getElementById("mStatus");
    if (statusBadge) {
        if (livro.ativo == 1) {
            statusBadge.textContent = "Disponível";
            statusBadge.style.backgroundColor = "#27ae60";
            if (btnAbrirReserva) btnAbrirReserva.style.backgroundColor = "#27ae60";
        } else {
            statusBadge.textContent = "Indisponível (Reservado)";
            statusBadge.style.backgroundColor = "#ff1900ff";

            if (btnAbrirReserva) {
                btnAbrirReserva.textContent = 'Indisponível para Reserva';
                btnAbrirReserva.style.backgroundColor = "#cc0000";
                btnAbrirReserva.disabled = true;
                btnAbrirReserva.style.display = 'block';
            }
        }
    }

    // Mostrar o Modal
    if (modal) modal.style.display = "flex";

    // Configurar botão de favoritar
    if (btnFavorito) {
        verificarFavoritoAtual(livro.id, btnFavorito);
        btnFavorito.onclick = () => {
            toggleFavorito(livro.id, btnFavorito);
        };
    }

    // Configurar eventos de fechar
    const btnFechar = document.querySelector(".fechar-modal");
    if (btnFechar) {
        btnFechar.onclick = () => { if (modal) modal.style.display = "none"; };
    }

    window.onclick = (event) => {
        if (event.target == modal) { modal.style.display = "none"; }
    };

    // LÓGICA DO BOTÃO E FORMULÁRIO DE RESERVA
    if (btnAbrirReserva && livro.ativo == 1 && !btnAbrirReserva.disabled) {
        btnAbrirReserva.onclick = () => {
            if (!obterUsuarioLogadoId()) {
                alert("Você precisa estar logado para fazer uma reserva. Redirecionando para o login.");
                window.location.href = 'index.html';
                return;
            }
            if (reservaFormContainer) reservaFormContainer.style.display = 'block';
            btnAbrirReserva.style.display = 'none';
            if (msgReserva) msgReserva.textContent = '';
        };
    }

    if (formReserva) {
        formReserva.onsubmit = (e) => {
            e.preventDefault();

            const dataRetiradaInput = document.getElementById("dataRetirada");
            const emailConfirmaInput = document.getElementById("emailConfirma");

            if (dataRetiradaInput && emailConfirmaInput) {
                const dataRetirada = dataRetiradaInput.value;
                const emailConfirma = emailConfirmaInput.value;

                finalizarReserva(livro.id, dataRetirada, emailConfirma);
            }
        };
    }
}

async function finalizarReserva(livroId, dataRetirada, emailConfirma) {
    const msgReserva = document.getElementById("msgReserva");
    const reservaFormContainer = document.getElementById("reservaFormContainer");
    const btnAbrirReserva = document.getElementById("btnAbrirReserva");
    const formReserva = document.getElementById("formReserva");

    const usuario_id = obterUsuarioLogadoId();
    if (!usuario_id) {
        if (msgReserva) {
            msgReserva.style.color = 'red';
            msgReserva.textContent = "Erro: Usuário não logado. Por favor, faça o login.";
        }
        if (formReserva) Array.from(formReserva.elements).forEach(el => el.disabled = false);
        return;
    }

    // Validação de data
    const dataRetiradaObj = new Date(dataRetirada);
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);
    dataRetiradaObj.setHours(0, 0, 0, 0);

    if (dataRetiradaObj.getTime() < dataAtual.getTime()) {
        if (msgReserva) {
            msgReserva.style.color = 'red';
            msgReserva.textContent = "A data de retirada deve ser no presente ou no futuro.";
        }
        return;
    }

    try {
        if (msgReserva) {
            msgReserva.style.color = 'yellow';
            msgReserva.textContent = "Processando reserva...";
        }

        if (formReserva) Array.from(formReserva.elements).forEach(el => el.disabled = true);

        const response = await fetch(API_RESERVAS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario_id: usuario_id,
                livro_id: livroId,
                data_retirada: dataRetirada,
                email_confirma: emailConfirma
            })
        });

        const data = await response.json();

        if (formReserva) Array.from(formReserva.elements).forEach(el => el.disabled = false);

        if (response.ok) {
            if (formReserva) formReserva.reset();
            if (reservaFormContainer) reservaFormContainer.style.display = 'none';

            if (msgReserva) {
                const dataPrevistaFormatada = data.data_devolucao_prevista.split('-').reverse().join('/');
                msgReserva.style.color = 'green';
                msgReserva.innerHTML = `✅ ${data.msg} <br> Devolução prevista: **${dataPrevistaFormatada}**`;
            }
            
            if (btnAbrirReserva) {
                document.getElementById("mStatus").textContent = "Indisponível (Reservado)";
                document.getElementById("mStatus").style.backgroundColor = "#ff1900ff";
                btnAbrirReserva.style.display = 'block';
                btnAbrirReserva.textContent = 'Reservado!';
                btnAbrirReserva.style.backgroundColor = "#cc0000";
                btnAbrirReserva.disabled = true;
            }

            setTimeout(carregarDestaques, 1000);
            setTimeout(() => {
                window.location.href = 'inicio.html';
            }, 2000);

        } else {
            if (msgReserva) {
                msgReserva.style.color = 'red';
                msgReserva.innerHTML = `❌ Erro ao reservar: **${data.erro || "Falha na comunicação com o servidor."}**`;
            }
            if (btnAbrirReserva) {
                btnAbrirReserva.style.display = 'none';
                if (reservaFormContainer) reservaFormContainer.style.display = 'block';
            }
        }

    } catch (erro) {
        console.error('Erro na requisição de reserva:', erro);
        if (formReserva) Array.from(formReserva.elements).forEach(el => el.disabled = false);

        if (msgReserva) {
            msgReserva.style.color = 'red';
            msgReserva.textContent = 'Erro de conexão ou servidor. Tente novamente.';
        }
        if (btnAbrirReserva) btnAbrirReserva.style.display = 'none';
        if (reservaFormContainer) reservaFormContainer.style.display = 'block';
    }
}

// ============================
// FUNÇÕES AUXILIARES
// ============================
async function registrarVisualizacao(livroId) {
    try {
        await fetch(`${API_URL}/${livroId}/visualizar`, { method: 'POST' });
    } catch (erro) { 
        console.error(erro); 
    }
}

function atualizarTitulo(texto) {
    const titulo = document.querySelector('.h2_degrade');
    if (titulo) titulo.textContent = texto;
}

function mostrarErro(mensagem) {
    const container = document.getElementById('livros');
    container.innerHTML = `<div style="color:white; text-align:center; padding:20px;">${mensagem} <br> <button onclick="carregarDestaques()">Voltar</button></div>`;
}

// ============================
// FUNÇÕES DE FAVORITOS
// ============================
async function toggleFavorito(livroId, botao) {
    const usuarioId = obterUsuarioLogadoId();
    
    if (!usuarioId) {
        alert("Você precisa estar logado para favoritar livros.");
        return;
    }
    
    try {
        // Primeiro, verifica se já está favoritado
        const checkResponse = await fetch(`${API_FAVORITOS}/verificar/${usuarioId}/${livroId}`);
        const checkData = await checkResponse.json();
        
        if (checkData.isFavorito) {
            // Se está favoritado, remove
            const deleteResponse = await fetch(`${API_FAVORITOS}/${usuarioId}/${livroId}`, {
                method: 'DELETE'
            });
            
            if (deleteResponse.ok) {
                botao.textContent = '🖤 Favoritar';
                botao.style.backgroundColor = '#007bff';
                console.log('Livro removido dos favoritos');
            }
        } else {
            // Se não está favoritado, adiciona
            const createResponse = await fetch(API_FAVORITOS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario_id: usuarioId,
                    livro_id: livroId
                })
            });
            
            if (createResponse.ok) {
                botao.textContent = '❤️ Favoritado';
                botao.style.backgroundColor = '#e74c3c';
                console.log('Livro adicionado aos favoritos');
            }
        }
    } catch (erro) {
        console.error('Erro ao togglear favorito:', erro);
        alert('Erro ao atualizar favoritos. Tente novamente.');
    }
}

async function verificarFavoritoAtual(livroId, botao) {
    const usuarioId = obterUsuarioLogadoId();
    
    if (!usuarioId) {
        botao.textContent = '🖤 Favoritar';
        botao.style.backgroundColor = '#007bff';
        return;
    }
    
    try {
        const response = await fetch(`${API_FAVORITOS}/verificar/${usuarioId}/${livroId}`);
        const data = await response.json();
        
        if (data.isFavorito) {
            botao.textContent = '❤️ Favoritado';
            botao.style.backgroundColor = '#e74c3c';
        } else {
            botao.textContent = '🖤 Favoritar';
            botao.style.backgroundColor = '#007bff';
        }
    } catch (erro) {
        console.error('Erro ao verificar favorito:', erro);
        botao.textContent = '🖤 Favoritar';
        botao.style.backgroundColor = '#007bff';
    }
}

// ============================
// INICIALIZAÇÃO
// ============================
document.addEventListener("DOMContentLoaded", () => {
    
    const params = new URLSearchParams(window.location.search);
    const termoURL = params.get("busca");

    if (termoURL && termoURL.trim() !== "") {
        const inputBusca = document.getElementById("busca");
        if (inputBusca) inputBusca.value = termoURL;
        buscarLivros(termoURL);
    } else {
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
            if (catBox) catBox.classList.remove('open');
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
                carregarDestaques();
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
                    carregarDestaques();
                }
            }, 500);
        });
    }
});