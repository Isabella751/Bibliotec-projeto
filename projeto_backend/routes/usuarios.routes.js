import express from "express"
import {
    criarUsuario,
    listarUsuarios,
    atualizarUsuario,
    obterUsuario,
    obterUsuarioPorEmail,
    deletarUsuario
} from "../controllers/usuarios.controller.js"; 

const router = express.Router();

router.get("/", listarUsuarios);
router.get("/email/:email", obterUsuarioPorEmail);  // ANTES de /:id para evitar conflito
router.get("/:id", obterUsuario);
router.post("/", criarUsuario);
router.put("/:id", atualizarUsuario);
router.delete("/:id", deletarUsuario);

export default router;