import express from "express";
import { getAtendimentos } from "../controllers/user.js";

const router = express.Router();

router.get("/", getAtendimentos);

export default router;