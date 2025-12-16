// scriptReservas.js
const BASE_URL_R = 'http://localhost:3000';
const API_RESERVAS = `${BASE_URL_R}/reservas`;
const API_LIVROS = `${BASE_URL_R}/livros`;
const API_USUARIOS = `${BASE_URL_R}/usuarios`;

function obterUsuarioLogadoId(){
    const id = localStorage.getItem('userId');
    return id ? parseInt(id) : null;
}

async function carregarPaginaReservas(){
    const userId = obterUsuarioLogadoId();
    if (!userId){
        document.getElementById('noReservations').textContent = 'Você precisa estar logado.';
        document.getElementById('noReservations').style.display = 'block';
        return;
    }

    // carregar dados do usuário (simples)
    try{
        const ru = await fetch(`${API_USUARIOS}/${userId}`);
        if (ru.ok){
            const user = await ru.json();
            document.getElementById('userName').textContent = user.nome || '—';
            document.getElementById('userEmail').textContent = user.email || '—';
            document.getElementById('userCurso').textContent = user.curso || '—';
        }
    }catch(err){ console.error('Erro ao obter usuário', err); }

    try{
        const resp = await fetch(API_RESERVAS);
        if (!resp.ok) throw new Error('Erro ao buscar reservas');
        const all = await resp.json();
        const my = all.filter(r => Number(r.usuario_id) === Number(userId));
        if (!my || my.length === 0){
            document.getElementById('noReservations').style.display = 'block';
            return;
        } else {
            document.getElementById('noReservations').style.display = 'none';
        }

        // buscar livros para mapear
        const rLivros = await fetch(`${API_LIVROS}?limite=1000`);
        const livros = rLivros.ok ? await rLivros.json() : [];
        const mapaLivros = new Map(); livros.forEach(l => mapaLivros.set(l.id, l));

        const carousel = document.getElementById('reservasCarousel');
        carousel.innerHTML = '';

        // agrupar por reserva_id
        const reservasById = new Map();
        my.forEach(row => {
            const rid = row.reserva_id;
            if (!reservasById.has(rid)) reservasById.set(rid, { resumo: row, livro_ids: [] });
            reservasById.get(rid).livro_ids.push(row.livro_id);
        });

        // para cada reserva, buscar detalhes completos e renderizar cards para cada item
        for (const [reservaId, obj] of reservasById.entries()){
            try{
                const detResp = await fetch(`${API_RESERVAS}/${reservaId}`);
                if (!detResp.ok) continue;
                const det = await detResp.json();
                const itens = det.itens || [];

                for (const item of itens){
                    const livro = mapaLivros.get(item.livro_id);
                    if (!livro) continue;

                    const card = document.createElement('div');
                    card.className = 'book-card';
                    card.dataset.reservaId = String(reservaId);
                    card.dataset.livroId = String(livro.id);

                    const img = document.createElement('img');
                    img.className = 'book-cover';
                    img.src = (livro.caminho_capa && livro.caminho_capa.length>5)? livro.caminho_capa : './images/placeholder.png';
                    img.alt = livro.titulo || 'Capa';

                    const info = document.createElement('div');
                    info.className = 'book-info';
                    const title = document.createElement('p');
                    title.className = 'book-title';
                    title.textContent = livro.titulo || 'Sem título';

                    info.appendChild(title);
                    card.appendChild(img);
                    card.appendChild(info);

                    // ao clicar abre modal com dados da reserva e do item
                    card.addEventListener('click', ()=>{
                        abrirDetalhesReserva(det, item, livro);
                    });

                    carousel.appendChild(card);
                }

            }catch(err){ console.error('Erro ao obter detalhes da reserva', err); }
        }

    }catch(err){
        console.error('Erro em carregarPaginaReservas', err);
        document.getElementById('noReservations').textContent = 'Erro ao carregar reservas.';
        document.getElementById('noReservations').style.display = 'block';
    }
}

/* Modal */
function abrirDetalhesReserva(reserva, item, livro){
    const modal = document.getElementById('modalReserva');
    document.getElementById('rCapa').src = (livro.caminho_capa && livro.caminho_capa.length>5) ? livro.caminho_capa : './images/placeholder.png';
    document.getElementById('rTitulo').textContent = livro.titulo || '—';
    document.getElementById('rAutor').textContent = livro.autor || '—';


    // Datas e status
    document.getElementById('rDataReserva').textContent = reserva.data_reserva || '--';
    document.getElementById('rDataRetirada').textContent = reserva.data_retirada_prevista || '--';
    // tenta obter data prevista do item (reserva_itens.data_prevista)
    document.getElementById('rDataDevolucao').textContent = item.data_prevista || reserva.data_devolucao_prevista || reserva.data_devolucao_real || '--';
    document.getElementById('rStatusText').textContent = reserva.status_reserva || '--';

    const status = document.getElementById('rStatus');
    const s = reserva.status_reserva || '';
    if (s.toLowerCase().includes('reserv')){ status.textContent = 'Reservado'; status.style.backgroundColor = '#f39c12'; }
    else if (s.toLowerCase().includes('emprest')){ status.textContent = 'Emprestado'; status.style.backgroundColor = '#27ae60'; }
    else if (s.toLowerCase().includes('atras')){ status.textContent = 'Atrasado'; status.style.backgroundColor = '#cc0000'; }
    else { status.textContent = s; status.style.backgroundColor = '#888'; }

    modal.style.display = 'flex';
    document.querySelector('#modalReserva .fechar-modal').onclick = fecharModalReserva;
    window.onclick = function(event){ if (event.target == modal) fecharModalReserva(); };
}

function fecharModalReserva(){
    const modal = document.getElementById('modalReserva');
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', carregarPaginaReservas);
