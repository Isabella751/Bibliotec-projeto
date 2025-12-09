window.addEventListener("scroll", function () {
    const header = document.querySelector(".main-header");

    if (window.scrollY > 10) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const categoryHeader = document.querySelector('.category-header');
    const categoryBox = document.querySelector('.category-box');

    if (categoryHeader && categoryBox) {
        categoryHeader.addEventListener('click', () => {
            categoryBox.classList.toggle('open');
        });
    }

    async function carregarLivros() {
        try {
            const res = await fetch("http://localhost:3000/livros");
            const livros = await res.json();
            const container = document.getElementById("livros");
            container.innerHTML = "";

            livros.forEach(livro => {
                console.log("Livro:", livro.titulo, "Capa:", livro.caminho_capa);

                const div = document.createElement("div");
                div.classList.add("livro-container");

                const img = document.createElement("img");
                img.classList.add("capa");
                img.src = livro.caminho_capa;
                img.alt = livro.titulo;
                img.onerror = () => console.error("Erro ao carregar imagem:", livro.caminho_capa); // <--- para ver erros

                const titulo = document.createElement("p");
                titulo.classList.add("livro-titulo");
                titulo.textContent = livro.titulo;

                div.appendChild(img);
                div.appendChild(titulo);
                container.appendChild(div);
            });
        } catch (err) {
            console.error("Erro geral:", err);
        }
        }

        carregarLivros();
});