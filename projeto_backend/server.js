import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

import livrosRoutes from "./routes/livros.routes.js";
import avaliacoesRoutes from "./routes/avaliacoes.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import favoritosRoutes from "./routes/favoritos.routes.js";
import reservasRoutes from "./routes/reservas.routes.js";
import loginRoutes from "./routes/login.routes.js";
import redSenha from "./routes/redSenha.routes.js";
import confirmarEmailRoutes from "./routes/confirmarEmail.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static('public'));

// Rotas da API
app.use("/livros", livrosRoutes);
app.use("/avaliacoes", avaliacoesRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/favoritos", favoritosRoutes);
app.use("/reservas", reservasRoutes);
app.use("/login", loginRoutes);
app.use("/senha", redSenha);


// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public', 'bibliotec.html'));
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:3000`);
});