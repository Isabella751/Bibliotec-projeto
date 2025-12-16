// scriptTelaFavoritos.js
const BASE_URL_FAV = 'http://localhost:3000';
const API_USUARIOS = `${BASE_URL_FAV}/usuarios`;
const API_LIVROS = `${BASE_URL_FAV}/livros`;
const API_FAVORITOS = `${BASE_URL_FAV}/favoritos`;

function obterUsuarioLogadoId() {
    const id = localStorage.getItem('userId');
    return id ? parseInt(id) : null;
}

async function carregarPaginaFavoritos() {
    const userId = obterUsuarioLogadoId();
    if (!userId) {
        document.getElementById('noFavorites').textContent = 'Você precisa estar logado.';
        document.getElementById('noFavorites').style.display = 'block';
        return;
    }

    // 1) Buscar dados do usuário
    try {
        const respUser = await fetch(`${API_USUARIOS}/${userId}`);
        if (respUser.ok) {
            const user = await respUser.json();
            document.getElementById('userName').textContent = user.nome || '—';
            document.getElementById('userEmail').textContent = user.email || '—';
            document.getElementById('userCurso').textContent = user.curso || '—';
        }
    } catch (err) {
        console.error('Erro ao carregar usuário', err);
    }

    // 2) Buscar favoritos do usuário
    try {
        const respFav = await fetch(`${API_FAVORITOS}?usuario_id=${userId}`);
        if (!respFav.ok) throw new Error('Erro ao buscar favoritos');
        const favs = await respFav.json();

        if (!favs || favs.length === 0) {
            document.getElementById('noFavorites').style.display = 'block';
            return;
        } else {
            document.getElementById('noFavorites').style.display = 'none';
        }

        // 3) Buscar todos os livros (map para id)
        const respLivros = await fetch(`${API_LIVROS}?limite=1000`);
        const livros = respLivros.ok ? await respLivros.json() : [];
        const mapa = new Map();
        livros.forEach(l => mapa.set(l.id, l));

        const carousel = document.getElementById('favoritesCarousel');
        carousel.innerHTML = '';

        favs.forEach(f => {
            const livro = mapa.get(f.livro_id) || null;
            if (!livro) return;

            const card = document.createElement('div');
            card.className = 'book-card';

            const img = document.createElement('img');
            img.className = 'book-cover';
            img.src = (livro.caminho_capa && livro.caminho_capa.length > 5) ? livro.caminho_capa : './images/placeholder.png';
            img.alt = livro.titulo || 'Capa';

            const info = document.createElement('div');
            info.className = 'book-info';

            const title = document.createElement('p');
            title.className = 'book-title';
            title.textContent = livro.titulo || 'Sem título';

            info.appendChild(title);
            card.appendChild(img);
            card.appendChild(info);
            card.dataset.livroId = String(livro.id);

            // abrir modal ao clicar no card
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                abrirDetalhesLivroFav(livro, f);
            });

            carousel.appendChild(card);
        });

    } catch (err) {
        console.error('Erro ao carregar favoritos', err);
        document.getElementById('noFavorites').textContent = 'Erro ao carregar favoritos.';
        document.getElementById('noFavorites').style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', carregarPaginaFavoritos);

/* ===== Modal & desfavoritar ===== */
function abrirDetalhesLivroFav(livro, favoritoRecord){
    const modal = document.getElementById('modalLivroFav');
    document.getElementById('mCapaFav').src = (livro.caminho_capa && livro.caminho_capa.length>5) ? livro.caminho_capa : './images/placeholder.png';
    document.getElementById('mTituloFav').textContent = livro.titulo || '—';
    document.getElementById('mAutorFav').textContent = livro.autor || '—';
    document.getElementById('mGeneroFav').textContent = livro.genero || '--';
    document.getElementById('mAnoFav').textContent = livro.ano_publicacao || '--';
    document.getElementById('mEditoraFav').textContent = livro.editora || '--';
    document.getElementById('mIsbnFav').textContent = livro.isbn || '--';
    document.getElementById('mSinopseFav').textContent = livro.sinopse || 'Sinopse não disponível.';

    // status
    const status = document.getElementById('mStatusFav');
    status.textContent = (livro.ativo==1) ? 'Disponível' : 'Indisponível';
    status.style.backgroundColor = (livro.ativo==1) ? '#27ae60' : '#cc0000';

    // store current livro id on button
    const btn = document.getElementById('btnDesfavoritarFav');
    btn.dataset.livroId = String(livro.id);

    btn.onclick = async () => {
        await desfavoritarLivro(livro.id);
        // fechar modal
        fecharModalFav();
    };

    // abrir modal
    modal.style.display = 'flex';

    // fechar handlers
    document.querySelector('#modalLivroFav .fechar-modal').onclick = fecharModalFav;
    window.onclick = function(event){ if (event.target == modal) fecharModalFav(); };
}

function fecharModalFav(){
    const modal = document.getElementById('modalLivroFav');
    modal.style.display = 'none';
}

async function desfavoritarLivro(livroId){
    const userId = obterUsuarioLogadoId();
    if (!userId) return;

    try{
        const resp = await fetch(`${API_FAVORITOS}/${userId}/${livroId}`, { method: 'DELETE' });
        if (!resp.ok) throw new Error('Falha ao desfavoritar');

        // remover do carrossel
        const carousel = document.getElementById('favoritesCarousel');
        const card = carousel.querySelector(`[data-livro-id='${livroId}']`);
        if (card) card.remove();

        // se não tiver mais favoritos, mostrar mensagem
        if (!carousel.querySelector('.book-card')){
            document.getElementById('noFavorites').style.display = 'block';
        }
    }catch(err){
        console.error('Erro ao desfavoritar:', err);
        alert('Erro ao remover dos favoritos.');
    }
}
