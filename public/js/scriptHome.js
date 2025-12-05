window.addEventListener("scroll", function () {
    const header = document.querySelector(".main-header");

    if (window.scrollY > 10) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('.category-header');
    const box = document.querySelector('.category-box');

    if (header && box) {
        header.addEventListener('click', () => {
            box.classList.toggle('open');
        });
    }

    const itens = document.querySelectorAll('.category-list p');

    itens.forEach(item => {
        item.addEventListener('click', () => {
            window.location.href = '../frontEnd/index.html';
        });
    });

    // Carregar livros do backend
    async function carregarLivros() {
        try {
            const res = await fetch('http://localhost:3000/livros');
            if (!res.ok) throw new Error('Erro ao carregar livros');

            const livros = await res.json();
            console.log('Livros carregados:', livros); // debug
            const container = document.getElementById('livros');
            container.innerHTML = ''; // Limpa o container

            const backendBase = 'http://localhost:3000'; // ajuste se o backend estiver em outro endereço
            const imagensPasta = '/book_images/'; // pasta pública no backend

            livros.forEach(livro => {
                const livroContainer = document.createElement('div');
                livroContainer.className = 'livro-container';

                const img = document.createElement('img');
                img.className = 'capa';
                img.alt = livro.titulo || 'Capa do livro';
                img.loading = 'lazy';

                // monta src: aceita URL absoluta, caminho relativo já com /book_images, ou só nome de arquivo
                if (livro.caminho_capa) {
                    const caminho = String(livro.caminho_capa).trim();

                    if (/^https?:\/\//i.test(caminho)) {
                        img.src = caminho;
                    } else if (caminho.startsWith('/')) {
                        // caminho absoluto no servidor -> prefixa backendBase
                        img.src = backendBase + caminho;
                    } else if (caminho.startsWith('book_images') || caminho.startsWith('public/book_images')) {
                        // já aponta para pasta book_images
                        img.src = backendBase + (caminho.startsWith('/') ? caminho : '/' + caminho);
                    } else {
                        // assume que no banco está só o filename ou subpasta em book_images
                        img.src = backendBase + imagensPasta + caminho.replace(/^\/+/, '');
                    }
                } else {
                    img.src = './images/placeholder.png';
                }

                // fallback se imagem não carregar
                img.onerror = () => { img.src = './images/placeholder.png'; };

                const titulo = document.createElement('p');
                titulo.className = 'livro-titulo';
                titulo.textContent = livro.titulo || 'Título indisponível';

                livroContainer.appendChild(img);
                livroContainer.appendChild(titulo);
                container.appendChild(livroContainer);
            });
        } catch (err) {
            console.error(err);
        }
    }

    carregarLivros();
});