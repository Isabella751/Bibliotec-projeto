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