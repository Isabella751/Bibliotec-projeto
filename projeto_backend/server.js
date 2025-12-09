import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import livrosRoutes from "./routes/livros.routes.js";
import avaliacoesRoutes from "./routes/avaliacoes.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import favoritosRoutes from "./routes/favoritos.routes.js";
import reservasRoutes from "./routes/reservas.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors()); // opcional para chamadas do frontend

// Serve toda a pasta public (opcional) e/ou apenas book_images
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/book_images", express.static(path.join(__dirname, "..", "public", "book_images")));

console.log('Servindo imagens de:', path.join(__dirname, '..', 'public', 'book_images'));

// Rotas da API
app.use("/livros", livrosRoutes);
app.use("/avaliacoes", avaliacoesRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/favoritos", favoritosRoutes);
app.use("/reservas", reservasRoutes);

// Rota principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "inicio.html"));
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:3000`);
});