document.addEventListener("DOMContentLoaded", () => {
    
    const API_URL = "http://localhost:3000/livros";

    // ==========================================
    // 1. PREVIEW DA CAPA
    // ==========================================
    const inputCapa = document.getElementById("caminho_capa");
    const imgPreview = document.getElementById("imgPreview");
    
    // URL Online (Resolve o erro de placeholder.png não encontrado)
    const CAPA_PADRAO = "https://placehold.co/300x450?text=Aguardando+Link";

    // --- CORREÇÃO DO ERRO DA LINHA 25 ---
    // Só adiciona o evento SE os elementos existirem na tela
    if (inputCapa && imgPreview) {
        
        // Inicia com a imagem padrão
        imgPreview.src = CAPA_PADRAO;

        inputCapa.addEventListener("input", () => {
            const url = inputCapa.value.trim();
            
            // Se tem texto suficiente, mostra a imagem
            if (url.length > 5) {
                imgPreview.src = url;
                imgPreview.style.display = "block";
            } else {
                imgPreview.src = CAPA_PADRAO;
            }
        });

        // Se o link for quebrado, volta para a padrão
        imgPreview.addEventListener("error", () => {
            if (imgPreview.src !== CAPA_PADRAO) {
                imgPreview.src = CAPA_PADRAO;
            }
        });

    } else {
        // Se cair aqui, é porque o ID no HTML ainda está errado
        console.error("ERRO: Não achei o id='caminho_capa' ou id='imgPreview' no HTML.");
    }

    // ==========================================
    // 2. ENVIO DO FORMULÁRIO
    // ==========================================
    const formLivro = document.getElementById("formLivro");

    if (formLivro) {
        formLivro.addEventListener("submit", async (e) => {
            e.preventDefault();

            const btnSalvar = document.querySelector(".btn-salvar");
            const msg = document.getElementById("msg");

            if(btnSalvar) {
                btnSalvar.disabled = true;
                btnSalvar.textContent = "Salvando...";
            }
            if(msg) msg.textContent = "";

            // Funções auxiliares
            const getVal = (id) => {
                const el = document.getElementById(id);
                return el ? el.value : "";
            };
            const getCheck = (id) => {
                const el = document.getElementById(id);
                return el ? el.checked : false;
            };

            const livroData = {
                titulo: getVal("titulo"),
                autor: getVal("autor"),
                editora: getVal("editora"),
                genero: getVal("genero"),
                ano_publicacao: getVal("ano"), 
                idioma: getVal("idioma"),
                isbn: getVal("isbn"),
                classificacao: getVal("classificacao"),
                sinopse: getVal("sinopse"),
                caminho_capa: getVal("caminho_capa"),
                formato: getVal("formato"),
                ativo: getCheck("ativo"),
                destaque: getCheck("destaque")
            };

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(livroData)
                });

                const result = await response.json();

                if (response.ok) {
                    if(msg) {
                        msg.style.color = "#00ff88"; 
                        msg.textContent = "Livro cadastrado com sucesso!";
                    }
                    formLivro.reset(); 
                    if(imgPreview) imgPreview.src = CAPA_PADRAO;
                } else {
                    throw new Error(result.erro || "Erro ao cadastrar.");
                }

            } catch (error) {
                console.error(error);
                if(msg) {
                    msg.style.color = "#ff4d4d";
                    msg.textContent = "Erro: " + error.message;
                }
            } finally {
                if(btnSalvar) {
                    btnSalvar.disabled = false;
                    btnSalvar.textContent = "Cadastrar Livro";
                }
            }
        });
    }
});