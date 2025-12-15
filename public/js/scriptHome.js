// ============================
// CONFIGURAÇÃO DA API
// ============================
const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/livros`;
const API_DESTAQUES = `${BASE_URL}/livros/destaques`;
const API_BUSCA = `${BASE_URL}/livros/busca`;
const API_RESERVAS = `${BASE_URL}/reservas`;

// O ID É OBTIDO DINAMICAMENTE
const coresCoracao = ['coracaoVazioAzul.png', 'coracaoVazioVerde.png'];

// ============================
// 1. FUNÇÃO PARA OBTER O ID DO USUÁRIO DINAMICAMENTE
// ============================
function obterUsuarioLogadoId() {
    // Busca o ID do usuário no localStorage (setado após o login)
    const id = localStorage.getItem('userId');
    if (id) {
        return parseInt(id);
    }
    // Se não encontrar, retorna nulo e a função de reserva é abortada
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
// 3. CARREGAR DESTAQUES (MOSTRA ATIVOS E INDISPONÍVEIS)
// ============================
async function carregarDestaques() {
    try {
        // Chamando API_URL para buscar todos os livros, incluindo os indisponíveis (ativo=0)
        const response = await fetch(`${API_URL}?limite=24`);
        if (!response.ok) throw new Error('Erro ao buscar destaques');
        const livros = await response.json();
        atualizarTitulo('Livros em Destaque');

        // NENHUM FILTRO APLICADO AQUI - EXIBE TODOS (Disponíveis e Indisponíveis)
        exibirLivros(livros);

    } catch (erro) {
        console.error('Erro ao carregar destaques:', erro);
        mostrarErro('Não foi possível carregar os destaques.');
    }
}

// ============================
// 4. BUSCA DE LIVROS (MOSTRA ATIVOS E INDISPONÍVEIS)
// ============================
async function buscarLivros(termoBusca) {
    try {
        // A rota de busca do backend deve retornar TODOS os livros (ativo=0 e ativo=1)
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

    inicializarCoracoes();
}

function criarCardLivro(livro, index) {
    const div = document.createElement('div');
    // Adicionei uma classe padrão 'card-livro' para facilitar o CSS
    div.className = `card-livro livro_${index + 1}`;

    const caminhoCapa = (livro.caminho_capa && livro.caminho_capa.length > 5)
        ? livro.caminho_capa
        : './images/placeholder.png';

    const corCoracao = coresCoracao[index % 2];

    // BADGES
    let badgeStatus = '';
    if (livro.ativo == 0) {
        badgeStatus = `<div class="badge-status">INDISPONÍVEL</div>`;
    }

    const badgeVisualizacoes = livro.visualizacoes > 0
        ? `<div class="badge-visu">${livro.visualizacoes} 👁️</div>`
        : '';

    div.innerHTML = `
        <div class="box-capa"> 
            ${badgeVisualizacoes}
            ${badgeStatus}
            
            <img class="capa-img" 
                 src="${caminhoCapa}" 
                 alt="${livro.titulo}"
                 title="${livro.titulo} - ${livro.autor}">
            
            <img class="fav" 
                 src="./images/${corCoracao}" 
                 alt="favorito"
                 data-livro-id="${livro.id}">
        </div>

        <div class="box-info">
            <p class="titulo-livro">${livro.titulo}</p>
            <p class="autor-livro">${livro.autor}</p>
        </div>
    `;

    // Adiciona evento de clique na imagem
    const imgCapa = div.querySelector(`.capa-img`);
    imgCapa.addEventListener('click', () => {
        registrarVisualizacao(livro.id);
        abrirDetalhesLivro(livro);
    });

    return div;
}

// ============================
// 7. LÓGICA DE RESERVA E VALIDAÇÃO DE DATA (CORREÇÃO)
// ============================

function abrirDetalhesLivro(livro) {
    const modal = document.getElementById("modalLivro");
    const btnAbrirReserva = document.getElementById("btnAbrirReserva");
    const reservaFormContainer = document.getElementById("reservaFormContainer");
    const msgReserva = document.getElementById("msgReserva");
    const formReserva = document.getElementById("formReserva");

    // --- 1. Reset de Estado ---
    if (formReserva) formReserva.reset();
    if (msgReserva) msgReserva.textContent = '';
    if (reservaFormContainer) reservaFormContainer.style.display = 'none';
    if (btnAbrirReserva) {
        btnAbrirReserva.textContent = 'Reservar Livro';
        btnAbrirReserva.disabled = false;
        btnAbrirReserva.style.display = 'block';
    }

    // 2. Preencher os dados
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
            // LÓGICA: Indisponível e desabilita o botão
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

    // 3. Mostrar o Modal
    if (modal) modal.style.display = "flex";

    // 4. Configurar eventos de fechar
    const btnFechar = document.querySelector(".fechar-modal");
    if (btnFechar) {
        btnFechar.onclick = () => { if (modal) modal.style.display = "none"; };
    }

    window.onclick = (event) => {
        if (event.target == modal) { modal.style.display = "none"; }
    };

    // 5. LÓGICA DO BOTÃO E FORMULÁRIO DE RESERVA
    if (btnAbrirReserva && livro.ativo == 1 && !btnAbrirReserva.disabled) {
        btnAbrirReserva.onclick = () => {
            // Verifica se o usuário está logado antes de abrir o formulário
            if (!obterUsuarioLogadoId()) {
                alert("Você precisa estar logado para fazer uma reserva. Redirecionando para o login.");
                window.location.href = 'index.html'; // Redireciona para o login
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

    // --- OBTENDO O ID DO USUÁRIO DINAMICAMENTE ---
    const usuario_id = obterUsuarioLogadoId();
    if (!usuario_id) {
        if (msgReserva) {
            msgReserva.style.color = 'red';
            msgReserva.textContent = "Erro: Usuário não logado. Por favor, faça o login.";
        }
        if (formReserva) Array.from(formReserva.elements).forEach(el => el.disabled = false);
        return;
    }
    // ---------------------------------------------

    // --- CORREÇÃO DA VALIDAÇÃO DE DATA (HOJE ou FUTURO) ---
    const dataRetiradaObj = new Date(dataRetirada);
    const dataAtual = new Date();

    // Zera as horas para comparar apenas o dia
    dataAtual.setHours(0, 0, 0, 0);
    dataRetiradaObj.setHours(0, 0, 0, 0);

    // Compara se a data de retirada é anterior ao dia de hoje
    if (dataRetiradaObj.getTime() < dataAtual.getTime()) {
        if (msgReserva) {
            msgReserva.style.color = 'red';
            msgReserva.textContent = "A data de retirada deve ser no presente ou no futuro.";
        }
        return;
    }
    // -------------------------------------


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
                usuario_id: usuario_id, // Usando o ID dinâmico e correto
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

            // Recarrega os dados para atualizar o status do card na lista
            setTimeout(carregarDestaques, 1000);

            setTimeout(() => {
                window.location.href = 'minhas-reservas.html'; // <--- Verifique se o nome bate com o arquivo
            }, 2000);

        } else {
            if (msgReserva) {
                msgReserva.style.color = 'red';
                msgReserva.innerHTML = ` Erro ao reservar: **${data.erro || "Falha na comunicação com o servidor."}**`;
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


// Funções auxiliares mantidas (registrarVisualizacao, etc.)
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
            const isBlue = fav.src.includes("Azul");
            if (fav.src.includes("Vazio")) {
                fav.src = isBlue ? "./images/coracaoPreenchidoAzul.png" : "./images/coracaoPreenchidoVerde.png";
            } else {
                fav.src = isBlue ? "./images/coracaoVazioAzul.png" : "./images/coracaoVazioVerde.png";
            }
        });
    });
}

// Inicialização
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