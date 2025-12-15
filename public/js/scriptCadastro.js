// A função auxiliar getQueryParams não é mais necessária, mas mantemos ela aqui por precaução se outras partes do seu código usarem.
function getQueryParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    return params;
}

// ==========================================================
// FUNÇÃO CENTRAL DE CONTROLE DE CAMPOS E PERFIL
// ==========================================================
const perfilSelect = document.getElementById("perfil");

function atualizarCamposBaseadoNoPerfil() {
    if (!perfilSelect) return;
    
    // Pega o valor, tratando 'null' ou 'undefined' como vazio
    const perfilValue = perfilSelect.value ? perfilSelect.value.toLowerCase() : '';

    // Elementos dependentes do perfil
    const dataNascimento = document.getElementById("data_nascimento") ? document.getElementById("data_nascimento").closest(".linha_cadastro") : null;
    const celular = document.getElementById("celular") ? document.getElementById("celular").closest(".linha_cadastro") : null;
    const curso = document.getElementById("curso") ? document.getElementById("curso").closest(".linha_cadastro") : null;
    
    // Elementos de Senha e Celular (Regras gerais)
    const senhaContainer = document.getElementById("senha") ? document.getElementById("senha").closest(".linha_cadastro") : null;
    const senhaLabel = document.querySelector('label[for="senha"]');
    const senhaObrigatorio = senhaLabel ? senhaLabel.querySelector(".obrigatorio") : null;

    // 1. CELULAR (sempre escondido)
    if (celular) {
        celular.style.display = "none";
        document.getElementById("celular").value = "";
    }
    const celularObrigatorio = document.querySelector('label[for="celular"] .obrigatorio');
    if (celularObrigatorio) {
        celularObrigatorio.style.display = "none";
    }

    // 2. SENHA (sempre visível e obrigatória)
    if (senhaContainer) senhaContainer.style.display = "flex";
    if (senhaObrigatorio) senhaObrigatorio.style.display = "inline";

    // 3. CAMPOS ESPECÍFICOS DE ALUNO (Data e Curso)

    if (perfilValue === "admin") {
        // Admin: esconde data, curso.
        if (dataNascimento) dataNascimento.style.display = "none";
        if (curso) curso.style.display = "none";
        
        // Limpa campos invisíveis para não enviar dados inválidos
        if (document.getElementById("data_nascimento")) document.getElementById("data_nascimento").value = "";
        if (document.getElementById("curso")) document.getElementById("curso").value = "";

    } else {
        // Aluno OU Perfil vazio (Valor inicial 'Selecione...'): mostra data, curso.
        if (dataNascimento) dataNascimento.style.display = "flex";
        if (curso) curso.style.display = "flex";
    }
}

// Adiciona listener para mudanças no perfil
if (perfilSelect) {
    perfilSelect.addEventListener("change", atualizarCamposBaseadoNoPerfil);
}
// ==========================================================


document.addEventListener("DOMContentLoaded", () => {
    
    // A lógica de visibilidade do perfil foi removida. O campo estará sempre visível.

    const perfilContainer = document.getElementById("perfil-container");
    const perfilSelect = document.getElementById("perfil");

    // O campo de perfil deve ter o estado inicial correto (mostrando data/curso se 'Selecione...' ou 'Aluno' estiver selecionado)
    atualizarCamposBaseadoNoPerfil();

    // --- Lógica de asteriscos e validação visual de campos ---
    const campos = document.querySelectorAll(".info-cadastro input, .info-cadastro select");

    campos.forEach(campo => {
        campo.addEventListener("input", () => {

            const asterisco = campo.closest(".linha_cadastro").querySelector(".obrigatorio");

            if (!asterisco) return;

            if (campo.value.trim() !== "") {
                asterisco.style.visibility = "hidden";
            } else {
                // Não mostra o asterisco se o campo estiver escondido
                const linhaCadastro = campo.closest(".linha_cadastro");
                
                // Verifica se a linha não está escondida
                const isHidden = linhaCadastro.style.display === 'none' || 
                                 linhaCadastro.style.visibility === 'hidden';

                if (!isHidden) {
                     asterisco.style.visibility = "visible";
                }
            }
        });
    });

    // --- O restante do script (máscaras, finalização e envio de dados) ---

    const senhaInput = document.getElementById("senha");
    const toggleSenha = document.getElementById("toggleSenha");

    if (toggleSenha && senhaInput) {
        toggleSenha.addEventListener("click", () => {
            const tipoAtual = senhaInput.getAttribute("type");

            if (tipoAtual === "password") {
                senhaInput.setAttribute("type", "text");
                toggleSenha.textContent = "visibility_off";
            } else {
                senhaInput.setAttribute("type", "password");
                toggleSenha.textContent = "visibility";
            }
        });
    }

    const celularInput = document.getElementById("celular");
    if (celularInput) {
        celularInput.addEventListener("input", function (e) {
            let valor = e.target.value;

            valor = valor.replace(/\D/g, "");

            if (valor.length > 11) valor = valor.slice(0, 11);

            let formatado = "";

            if (valor.length > 0) formatado = "(" + valor.substring(0, 2);
            if (valor.length >= 3) formatado += ") " + valor.substring(2, 7);
            if (valor.length >= 8) formatado += "-" + valor.substring(7, 11);

            e.target.value = formatado;
        });
    }


    const cpfInput = document.getElementById("cpf");
    if (cpfInput) {
        cpfInput.addEventListener("input", function (e) {
            let valor = e.target.value;

            valor = valor.replace(/\D/g, "");

            if (valor.length > 11) valor = valor.slice(0, 11);

            let formatado = "";

            if (valor.length > 0) formatado = valor.substring(0, 3);
            if (valor.length >= 4) formatado += "." + valor.substring(3, 6);
            if (valor.length >= 7) formatado += "." + valor.substring(6, 9);
            if (valor.length >= 10) formatado += "-" + valor.substring(9, 11);

            e.target.value = formatado;
        });
    }


    function finalizarCadastro() {

        if (window.opener && !window.opener.closed) {
            window.opener.location.href = "inicio.html";
        }

        window.close();
    }

    // Impedir números no campo nome
    const nomeInput = document.getElementById("nome");
    if (nomeInput) {
        nomeInput.addEventListener("input", () => {
            nomeInput.value = nomeInput.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
        });
    }

    const btn = document.getElementById("btnCadastrar");
    const formCadastro = document.getElementById("formCadastro");

    if (btn) {
        btn.addEventListener("click", async () => {

            // Termos
            if (document.getElementById("termos") && !document.getElementById("termos").checked) {
                alert("Você precisa aceitar os termos antes de continuar.");
                return;
            }

            // Coleta valores
            const nome = document.getElementById("nome") ? document.getElementById("nome").value.trim() : "";
            const cpf = document.getElementById("cpf") ? document.getElementById("cpf").value.trim() : "";
            const email = document.getElementById("email") ? document.getElementById("email").value.trim() : "";
            const senha = document.getElementById("senha") ? document.getElementById("senha").value.trim() : "";
            const data_nascimento = document.getElementById("data_nascimento") ? document.getElementById("data_nascimento").value : "";
            const curso = document.getElementById("curso") ? document.getElementById("curso").value : "";
            
            // LÊ O PERFIL ATUAL
            const perfil = document.getElementById("perfil") ? document.getElementById("perfil").value : ""; 

            // Validações

            if (!nome) {
                alert("O nome é obrigatório.");
                return;
            }
            if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
                alert("O nome não pode conter números ou caracteres inválidos.");
                return;
            }

            const cpfLimpo = cpf.replace(/\D/g, "");
            if (!cpf) {
                alert("O CPF é obrigatório.");
                return;
            }
            if (cpfLimpo.length !== 11) {
                alert("O CPF deve conter 11 números.");
                return;
            }

            if (!email) {
                alert("O email é obrigatório.");
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Digite um email válido (exemplo: usuario@gmail.com).");
                return;
            }

            // Validação de perfil
            if (!perfil) {
                alert("Selecione um perfil.");
                return;
            }
            
            // Normaliza perfil
            const perfilNormalizado = String(perfil).toLowerCase();

            // SENHA É OBRIGATÓRIA PARA ADMIN E ALUNO
            if (!senha) {
                alert("A senha é obrigatória.");
                return;
            }
            if (senha.length < 8) {
                alert("A senha deve ter no mínimo 8 caracteres.");
                return;
            }

            // Curso e Data obrigatórios APENAS para alunos
            if (perfilNormalizado === "aluno") {
                if (!curso) {
                    alert("Selecione um curso.");
                    return;
                }
                if (!data_nascimento) {
                    alert("Informe sua data de nascimento.");
                    return;
                }
            }
            
            // Monta o payload
            const payload = {
                nome,
                cpf,
                email,
                senha, 
                perfil: perfilNormalizado // Garante que o valor enviado é 'aluno' ou 'admin'
            };
            
            if (perfilNormalizado === "aluno") {
                payload.data_nascimento = data_nascimento;
                payload.curso = curso;
            }

            try {
                const resposta = await fetch("http://localhost:3000/usuarios", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                const data = await resposta.json();

                if (!resposta.ok) {
                    alert(data.erro || "Erro ao cadastrar usuário.");
                    return;
                }

                alert("Cadastro realizado com sucesso!");
                
                // Limpa o formulário
                if (formCadastro) formCadastro.reset();
                
                // Reconfigura o estado inicial do perfil e campos (volta para o estado 'Selecione...')
                if (perfilSelect) perfilSelect.value = '';
                atualizarCamposBaseadoNoPerfil();
                
                // Restaura os asteriscos
                const asteriscos = document.querySelectorAll(".obrigatorio");
                asteriscos.forEach(asterisco => {
                    const input = asterisco.closest(".linha_cadastro").querySelector("input, select");
                    if (input && input.value.trim() === "") {
                        // Só mostra se o campo não estiver escondido
                         const linha = input.closest(".linha_cadastro");
                         if (!linha || linha.style.display !== 'none') {
                             asterisco.style.visibility = "visible";
                         }
                    }
                });


            } catch (erro) {
                console.error("Erro na requisição:", erro);
                alert("Falha ao conectar com o servidor.");
            }

        });
    }

    // Permitir CADASTRO ao apertar ENTER
    if (formCadastro && btn) {
        formCadastro.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault(); 
                btn.click(); 
            }
        });
    }

    // Aviso de Caps Lock no cadastro
    const senhaCadastro = document.getElementById("senha");
    const capsWarningCadastro = document.getElementById("capsWarning");

    if (senhaCadastro && capsWarningCadastro) {
        senhaCadastro.addEventListener("keyup", function (event) {
            if (event.getModifierState("CapsLock")) {
                capsWarningCadastro.style.display = "block";
            } else {
                capsWarningCadastro.style.display = "none";
            }
        });
    }
});