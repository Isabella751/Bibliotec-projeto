import express from "express";
import {
    criarReserva,
    listarReservas,
    obterReserva,
    excluirReserva,
    
} from "../controllers/reservas.controller.js";

const router = express.Router();

router.post("/", criarReserva);
router.get("/", listarReservas);
router.get("/:id", obterReserva);
router.delete("/:id", excluirReserva);
// Rota de devolução (opcional, dependendo de como você gere o empréstimo)
// router.put("/devolver", devolverLivro); 

export default router;