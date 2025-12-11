const pasta = "../public/images/";

const imagens = [
  "ft biblioteca.jpg",
  "ft biblioteca2.jpg",
  "ft biblioteca3.jpg",
  "ft livros.jpg",
  "ft livros2.jpg",
  "ft livros3.jpg",
];

const container = document.getElementById("carrossel-inner");

// adiciona as imagens no HTML
imagens.forEach((img) => {
  const elemento = document.createElement("img");
  elemento.src = pasta + img;
  container.appendChild(elemento);
});

let index = 0;

// pega os slides (imagens)
const slides = container.querySelectorAll("img");
if (slides.length > 0) slides[0].classList.add("active");

function mudarImagem() {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}

setInterval(mudarImagem, 3000);

// mostrar senha
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

// header dinâmico
window.addEventListener("scroll", () => {
  const header = document.querySelector(".main-header");
  window.scrollY > 10
    ? header.classList.add("scrolled")
    : header.classList.remove("scrolled");
});

// abrir cadastro
function abrirCadastro() {
  window.open("cadastro.html", "cadastroJanela", "width=900,height=700");
}

// login
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("entrar");

  btn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
      alert("Preencha email e senha.");
      return;
    }

    try {
      const resposta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        alert(data.erro);
        return;
      }

      // Salva o email no localStorage para uso posterior
      console.log("Email do login:", data.email);
      localStorage.setItem("emailUsuario", data.email);
      console.log("Email salvo no localStorage:", localStorage.getItem("emailUsuario"));

      if (data.tipo === "Admin") {
        window.location.href = "loginAdmin.html";
      } else if (data.tipo === "Aluno") {
        window.location.href = "inicio.html";
      }

    } catch (erro) {
      alert("Erro ao conectar ao servidor.");
    }
  });
});

const senhaInput = document.getElementById("senha");
const capsWarning = document.getElementById("capsWarning");

senhaInput.addEventListener("keydown", function (e) {
  if (e.getModifierState("CapsLock")) {
    capsWarning.classList.add("show");
  } else {
    capsWarning.classList.remove("show");
  }
});

senhaInput.addEventListener("blur", () => {
  capsWarning.classList.remove("show");
});

// Permitir entrar ao apertar ENTER
const formCadastro = document.getElementById("entrar");
const senhaCadastro = document.getElementById("senha");
const capsWarningCadastro = document.getElementById("capsWarning");

formCadastro.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // impede o form de recarregar
    document.getElementById("entrar").click(); // aciona o botão
  }
});
