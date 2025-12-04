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
            if (!res.ok) throw new Error('Erro ao buscar livros');

            const livros = await res.json();
            const container = document.getElementById('livros');
            container.innerHTML = ''; // Limpa o container

            // Helper para montar o caminho da imagem
            function buildSrc(caminho) {
                if (!caminho) return '/book_images/default.jpg';
                if (caminho.startsWith('http://') || caminho.startsWith('https://')) 
                    return caminho;
                if (caminho.includes('/')) 
                    return '/' + caminho.replace(/^\/+/, '');
                return '/book_images/' + caminho;
            }

            // Renderiza cada livro
            livros.forEach((livro, idx) => {
                const wrap = document.createElement('div');
                wrap.className = `livro_item livro_${idx + 1}`;

                const img = document.createElement('img');
                img.src = buildSrc(livro.caminho_capa);
                img.alt = livro.titulo || 'Capa do livro';
                img.className = `capa capa-${idx + 1}`;
                img.style.cursor = 'pointer';

                // Clique na capa para abrir detalhes (opcional)
                img.addEventListener('click', () => {
                    console.log('Livro clicado:', livro);
                    // Você pode redirecionar para uma página de detalhes
                    // window.location.href = `/detalhes.html?id=${livro.id}`;
                });

                wrap.appendChild(img);
                container.appendChild(wrap);
            });

            console.log('✅ Livros carregados com sucesso!', livros.length);

        } catch (err) {
            console.error('❌ Erro ao carregar livros:', err);
            document.getElementById('livros').innerHTML = 
                '<p style="color: red; text-align: center;">Erro ao carregar livros. Tente mais tarde.</p>';
        }
    }

    carregarLivros();
});