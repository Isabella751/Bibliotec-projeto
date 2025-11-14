// caminho correto das imagens (a partir do HTML)
const pasta = "../public/images/";

// lista de imagens
const imagens = [
    "ft biblioteca.jpg",
    "ft biblioteca2.jpg",
    "ft biblioteca3.jpg",
    "ft livros.jpg",
    "ft livros2.jpg",
    "ft livros3.jpg"
];

// pega o container
const container = document.getElementById("carrossel-inner");

// adiciona as imagens no HTML
imagens.forEach(img => {
    const elemento = document.createElement("img");
    elemento.src = pasta + img;
    container.appendChild(elemento);
});

// lógica de animação
let index = 0;

function mudarImagem() {
    index++;
    if (index >= imagens.length) index = 0;

    container.style.transform = `translateX(-${index * 100}%)`;
}

setInterval(mudarImagem, 3000);
