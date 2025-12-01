// routes/login.routes.js
import express from "express";
import { login } from "../controllers/login.controller.js";

const router = express.Router();

router.post("/", login);

export default router;