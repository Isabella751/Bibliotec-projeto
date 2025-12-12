import express from "express"
import {
    obterAdmin,
    obterAdminPorEmail
} from "../controllers/admin.controller.js"; 

const router = express.Router();

router.get("/email/:email", obterAdminPorEmail);
router.get("/:id", obterAdmin);


export default router;