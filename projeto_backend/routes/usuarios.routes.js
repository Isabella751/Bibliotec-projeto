// usuarios.routes.js

import express from "express"
import {
    criarUsuario,
    listarUsuarios,
    atualizarUsuario,
    obterUsuario,
    obterUsuarioPorEmail,
    deletarUsuario,
    // NOVO: Importar a função de definição de senha
    definirSenhaPorToken 
} from "../controllers/usuarios.controller.js"; 

const router = express.Router();

router.get("/", listarUsuarios);
router.get("/email/:email", obterUsuarioPorEmail);
router.get("/:id", obterUsuario);

// Rotas de Ação
router.post("/", criarUsuario);

// NOVO: Rota para concluir o cadastro/definir a senha
// O endpoint deve ser '/definir-senha'
router.post("/definir-senha", definirSenhaPorToken); 

router.put("/:id", atualizarUsuario);
router.delete("/:id", deletarUsuario);

export default router;