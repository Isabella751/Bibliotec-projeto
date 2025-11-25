// ============================
//  Dependências
// ============================
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import livrosRoutes from "./routes/livros.routes.js"
import avaliacoesRoutes from "./routes/avaliacoes.routes.js"
import usuariosRoutes from "./routes/usuarios.routes.js"
import favoritosRoutes from "./routes/favoritos.routes.js"
import reservasRoutes from "./routes/reservas.routes.js"



// ============================
//  Configuração do servidor
// ============================
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res)=>{
  res.send("API rodando com sucesso")
})

app.use("/livros", livrosRoutes)
app.use("/avaliacoes", avaliacoesRoutes)
app.use("/usuarios", usuariosRoutes)
app.use("/favoritos", favoritosRoutes)
app.use("/reservas", reservasRoutes)


// ============================
//  Inicia o servidor
// ============================
const PORT = 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));