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

// login
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        alert(data.erro);
        return;
      }

      console.log("Usuário logado:", data);

      // evita conflito
      localStorage.removeItem("emailUsuario");
      localStorage.removeItem("emailadmin");

      if (data.tipo === "Admin") {
        localStorage.setItem("emailadmin", data.email);
        window.location.href = "inicioAdmin.html";
        return;
      }

      if (data.tipo === "Aluno") {
        localStorage.setItem("emailUsuario", data.email);
        window.location.href = "inicio.html";
        return;
      }

    } catch (erro) {
      alert("Erro ao conectar ao servidor.");
    }
  });
});


// CAPS LOCK
const senhaInput = document.getElementById("senha");
const capsWarning = document.getElementById("capsWarning");

if (senhaInput) {
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
}

// ENTER para logar
const emailInput = document.getElementById("email");

if (emailInput) {
  emailInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("entrar").click();
    }
  });
}

if (senhaInput) {
  senhaInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("entrar").click();
    }
  });
}

// ============================
// CONFIGURAÇÃO DO LOGIN
// ============================
const BASE_URL = 'http://localhost:3000'; 
const API_LOGIN = `${BASE_URL}/usuarios/login`; // Ajuste a rota se necessário

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById('form-login');
    const btnEntrar = document.getElementById('entrar').querySelector('button');
    const inputEmail = document.getElementById('email');
    const inputSenha = document.getElementById('senha');
    const capsWarning = document.getElementById('capsWarning');
    
    // ============================
    // 1. LÓGICA DO BOTÃO ENTRAR
    // ============================
    if (btnEntrar) {
        btnEntrar.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = inputEmail.value.trim();
            const senha = inputSenha.value.trim();

            if (!email || !senha) {
                alert("Por favor, preencha o email e a senha.");
                return;
            }

            try {
                btnEntrar.textContent = 'Entrando...';
                btnEntrar.disabled = true;

                const response = await fetch(API_LOGIN, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    // SUCESSO NO LOGIN!
                    
                    // 1. Salva o ID do usuário no localStorage
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('perfil', data.perfil); // Salva o perfil para futuras checagens

                    alert(`Login de ${data.perfil} (ID: ${data.userId}) realizado com sucesso!`);
                    
                    // 2. Redireciona para a tela principal (biblioteca)
                    window.location.href = 'bibliotec.html'; 

                } else {
                    // ERRO NO LOGIN (Email/Senha incorretos, etc.)
                    alert(`Falha no Login: ${data.erro || "Erro desconhecido."}`);
                }

            } catch (error) {
                console.error('Erro de conexão ou servidor:', error);
                alert("Erro de comunicação com o servidor. Tente novamente mais tarde.");
            } finally {
                btnEntrar.textContent = 'Entrar';
                btnEntrar.disabled = false;
            }
        });
    }

    // ============================
    // 2. LÓGICA CAPS LOCK E MOSTRAR SENHA (Reimplementação)
    // ============================

    if (inputSenha) {
        // Alerta Caps Lock
        inputSenha.addEventListener('keydown', (event) => {
            if (event.getModifierState && event.getModifierState('CapsLock')) {
                capsWarning.style.display = 'block';
            } else {
                capsWarning.style.display = 'none';
            }
        });

        // Limpa o alerta ao perder o foco
        inputSenha.addEventListener('blur', () => {
            capsWarning.style.display = 'none';
        });
    }

});

// Função global para alternar visibilidade da senha (chamada pelo HTML)
function mostrarSenha() {
    const senhaInput = document.getElementById('senha');
    const toggleSpan = document.querySelector('.toggle-senha .material-symbols-outlined');

    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        toggleSpan.textContent = 'visibility_off';
    } else {
        senhaInput.type = 'password';
        toggleSpan.textContent = 'visibility';
    }
}

// ============================
// Lógica do Carrossel (Se houver)
// ============================
// Mantenha aqui a lógica do seu carrossel, se for aplicável.
// Se você não tem essa lógica aqui, pode remover esta seção.

