import express from "express";
import { getAtendimentos, createAtendimento } from "../controllers/user.js";

const router = express.Router();

router.post("/", createAtendimento);
router.get("/", getAtendimentos);

export default router;