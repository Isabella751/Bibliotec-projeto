// ============================
//  Dependências
// ============================
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import path from 'path';  
import { fileURLToPath } from 'url';

import livrosRoutes from "./routes/livros.routes.js"
import avaliacoesRoutes from "./routes/avaliacoes.routes.js"
import usuariosRoutes from "./routes/usuarios.routes.js"
import favoritosRoutes from "./routes/favoritos.routes.js"
import reservasRoutes from "./routes/reservas.routes.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ============================
//  Configuração do servidor
// ============================
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'frontEnd')));

// Servir CSS (se estiver fora do frontEnd)
app.use('/css', express.static(path.join(__dirname, 'css')));

// Servir imagens
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/book_images', express.static(path.join(__dirname, 'public/book_images')));

app.use("/livros", livrosRoutes)
app.use("/avaliacoes", avaliacoesRoutes)
app.use("/usuarios", usuariosRoutes)
app.use("/favoritos", favoritosRoutes)
app.use("/reservas", reservasRoutes)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// ============================
//  Inicia o servidor
// ============================
const PORT = 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));