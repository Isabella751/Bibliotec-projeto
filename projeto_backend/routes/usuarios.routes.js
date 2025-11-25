import express from "express"
import {
    criarUsuario,
    listarUsuarios,
    atualizarUsuario,
    obterUsuario,
    deletarUsuario
} from "../controllers/usuarios.controller.js"; 

const router = express.Router();

router.get("/", listarUsuarios);
router.get("/:id", obterUsuario);
router.post("/", criarUsuario);
router.put("/:id", atualizarUsuario);
router.delete("/:id", deletarUsuario);

export default router;