import express from "express";
import {
    criarReserva,
    listarReservas,
    obterReserva,
    excluirReserva,
    buscarReservasUsuario
    
} from "../controllers/reservas.controller.js";

const router = express.Router();

router.get("/usuario/:usuarioId", buscarReservasUsuario);
router.post("/", criarReserva);
router.get("/", listarReservas);
router.get("/:id", obterReserva);
router.delete("/:id", excluirReserva);



export default router;