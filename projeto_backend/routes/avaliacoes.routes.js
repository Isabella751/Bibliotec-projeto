import express from "express"
import {
    criarAvaliacao,
    listarAvaliacoes,
    obterAvaliacao,
    editarAvaliacao,
    excluirAvaliacao
} from "../controllers/avaliacoes.controller.js";

const router = express.Router();

router.get("/", listarAvaliacoes);      
router.get("/:id", obterAvaliacao);   
router.post("/", criarAvaliacao);    
router.put("/:id", editarAvaliacao);    
router.delete("/:id", excluirAvaliacao); 

export default router;
