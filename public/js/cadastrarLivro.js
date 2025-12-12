// 🔒 VERIFICA SE USUÁRIO É ADM
(async () => {
    const bloqueio = document.getElementById("bloqueio");

    try {
        const user = JSON.parse(localStorage.getItem("usuarioLogado"));

        if (!user) {
            bloqueio.innerHTML = "<p>Você não está logado.</p>";
            bloqueio.style.display = "block";
            document.getElementById("formLivro").style.display = "none";
            return;
        }

        // Supondo que você já tem uma tabela ADMIN
        const resp = await fetch(`/admin/${user.id}`);
        const dados = await resp.json();

        if (!dados.isAdmin) {
            bloqueio.innerHTML = "<p>Acesso negado. Apenas administradores!</p>";
            bloqueio.style.display = "block";
            document.getElementById("formLivro").style.display = "none";
            return;
        }

        // Admin → libera formulário
        bloqueio.style.display = "none";

    } catch (err) {
        bloqueio.innerHTML = "<p>Erro ao validar acesso.</p>";
        bloqueio.style.display = "block";
        document.getElementById("formLivro").style.display = "none";
    }
})();


// 🔍 PREVIEW DA CAPA
document.getElementById("caminho_capa").addEventListener("input", () => {
    const url = document.getElementById("caminho_capa").value;
    const img = document.getElementById("preview");

    if (url.length > 5) {
        img.src = url;
        img.style.display = "block";
    } else {
        img.style.display = "none";
    }
});


// 📚 ENVIAR LIVRO
document.getElementById("formLivro").addEventListener("submit", async (e) => {
    e.preventDefault();

    const livro = {
        titulo: titulo.value,
        autor: autor.value,
        genero: genero.value,
        editora: editora.value,
        ano_publicacao: ano_publicacao.value,
        isbn: isbn.value,
        idioma: idioma.value,
        formato: formato.value,
        caminho_capa: caminho_capa.value,
        classificacao: classificacao.value,
        sinopse: sinopse.value,
        ativo: ativo.value
    };

    const msg = document.getElementById("msg");

    try {
        const resp = await fetch("http://localhost:3000/livros", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(livro)
        });

        const dados = await resp.json();

        if (!resp.ok) {
            msg.style.color = "red";
            msg.textContent = dados.erro;
            return;
        }

        msg.style.color = "green";
        msg.textContent = "Livro cadastrado com sucesso!";

        document.getElementById("formLivro").reset();
        preview.style.display = "none";

    } catch (err) {
        msg.style.color = "red";
        msg.textContent = "Erro ao cadastrar.";
    }
});
// 🔁 PERMITIR CADASTRO AO APERTAR ENTER
const formLivro = document.getElementById("formLivro");

formLivro.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault(); // impede o form de recarregar
        document.getElementById("btnCadastrarLivro").click(); // aciona o botão
    }
});