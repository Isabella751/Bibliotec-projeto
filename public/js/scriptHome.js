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
});

window.addEventListener("scroll", () => {
    const leftIcons = document.querySelector(".left-icons");
    const rightIcons = document.querySelector(".right-icons");
    const categoryBox = document.querySelector(".category-box");
    const lineRight = document.querySelector(".linha-right");

    if (window.scrollY > 50) {
        leftIcons.classList.add("hide-left");
        rightIcons.classList.add("hide-right");
        categoryBox.classList.add("hide-category");
        lineRight.classList.add("hide-line");
    } else {
        leftIcons.classList.remove("hide-left");
        rightIcons.classList.remove("hide-right");
        categoryBox.classList.remove("hide-category");
        lineRight.classList.remove("hide-line");
    }
});

// CORAÇÕES — FAVORITAR LIVROS
document.addEventListener("DOMContentLoaded", () => {
    
    const favIcons = document.querySelectorAll(".fav");

    favIcons.forEach(fav => {
        fav.addEventListener("click", (e) => {
            e.stopPropagation(); // evita propagação de cliques

            // detecta a cor atual do coração (azul ou verde)
            const srcAtual = fav.src;
            let vazio, cheio, cor;

            if (srcAtual.includes("VazioAzul") || srcAtual.includes("PreenchidoAzul")) {
                vazio = "./images/coracaoVazioAzul.png";
                cheio = "./images/coracaoPreenchidoAzul.png";
                cor = "azul";
            } else if (srcAtual.includes("VazioVerde") || srcAtual.includes("PreenchidoVerde")) {
                vazio = "./images/coracaoVazioVerde.png";
                cheio = "./images/coracaoPreenchidoVerde.png";
                cor = "verde";
            } else {
                // fallback para azul caso a cor não seja detectada
                vazio = "./images/coracaoVazioAzul.png";
                cheio = "./images/coracaoPreenchidoAzul.png";
                cor = "azul";
            }

            // alterna entre vazio e cheio
            if (fav.classList.contains("active")) {
                fav.src = vazio;        // volta ao vazio
                fav.classList.remove("active");
            } else {
                fav.src = cheio;        // vira cheio
                fav.classList.add("active");
            }

            // opcional: log para debug
            console.log(`Coração ${cor} alternado para:`, fav.classList.contains("active") ? "cheio" : "vazio");
        });
    });

});


