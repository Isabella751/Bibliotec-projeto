import express from "express"
import { 
    listarUsuarios, 
    criarUsuario, 
    obterUsuario,
    editarUsuario,
    deletarUsuario
} from "../controllers/usuarios.controller.js"


const router = express.Router();

// usuarios //
router.get("/", listarUsuarios);
router.post("/", criarUsuario);
router.get("/:id", obterUsuario);
router.put("/:id", editarUsuario);
router.delete("/:id", deletarUsuario);

export default router;