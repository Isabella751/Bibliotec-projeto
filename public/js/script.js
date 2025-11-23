const pasta = "../public/images/";

const imagens = [
    "ft biblioteca.jpg",
    "ft biblioteca2.jpg",
    "ft biblioteca3.jpg",
    "ft livros.jpg",
    "ft livros2.jpg",
    "ft livros3.jpg"
];

const container = document.getElementById("carrossel-inner");

// adiciona as imagens no HTML
imagens.forEach(img => {
    const elemento = document.createElement("img");
    elemento.src = pasta + img;
    container.appendChild(elemento);
});

let index = 0;

// pega os slides (imagens) depois de criar
const slides = container.querySelectorAll('img');
if (slides.length > 0) slides[0].classList.add('active');

function mudarImagem() {
    // remove classe active do atual
    slides[index].classList.remove('active');

    // avança índice
    index = (index + 1) % slides.length;

    // adiciona classe active ao próximo
    slides[index].classList.add('active');
}

setInterval(mudarImagem, 3000); // muda a cada 3s

function mostrarSenha() {
    const senha = document.getElementById("senha");
    const icone = document.querySelector(".toggle-senha span");
    if (senha.type === "password") {
        senha.type = "text";
        icone.textContent = "visibility_off";
    } else {
        senha.type = "password";
        icone.textContent = "visibility";
    }
}

window.addEventListener("scroll", function () {
    const header = document.querySelector(".main-header");

    if (window.scrollY > 10) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

function abrirCadastro() {
    window.open("cadastro.html", "cadastroJanela", "width=900,height=700");
}
