// usuarios.routes.js

import express from "express"
import {
    criarUsuario,
    listarUsuarios,
    atualizarUsuario,
    obterUsuario,
    obterUsuarioPorEmail,
    deletarUsuario,
    definirSenhaPorToken,
    // ADICIONE A FUNÇÃO DE LOGIN AQUI
    loginUsuario 
} from "../controllers/usuarios.controller.js"; // ATENÇÃO: Verifique se o nome do arquivo controller está correto (usuario.controller.js)

const router = express.Router();

// ======================================
// 1. ROTA DE AUTENTICAÇÃO
// ======================================
router.post("/login", loginUsuario); 

// ======================================
// 2. ROTAS DE LEITURA (GET)
// ======================================
router.get("/", listarUsuarios);
router.get("/email/:email", obterUsuarioPorEmail);
router.get("/:id", obterUsuario);

// ======================================
// 3. ROTAS DE AÇÃO (POST / PUT / DELETE)
// ======================================
router.post("/", criarUsuario);

// Rota para concluir o cadastro/definir a senha
router.post("/definir-senha", definirSenhaPorToken); 

router.put("/:id", atualizarUsuario);
router.delete("/:id", deletarUsuario);

export default router;