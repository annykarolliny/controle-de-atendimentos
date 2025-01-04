import express from "express";
import { getAtendimentos, createAtendimento, deleteAtendimento, updateAtendimento } from "../controllers/user.js";
import { deleteAdm, getAdms, insertAdm } from "../controllers/admController.js";
import { deleteService, getServices, insertService } from "../controllers/servicesController.js";

const router = express.Router();

// Rotas de atendimentos

router.post("/", createAtendimento);
router.get("/", getAtendimentos);
router.delete("/api/records/:id", deleteAtendimento);
router.put("/api/records/:id", updateAtendimento);

// Rotas de administradores

router.get("/adms", getAdms);
router.post("/adms", insertAdm);
router.delete("/adms/api/records/:cpf", deleteAdm);

// Rotas para serviços

router.get("/services", getServices);
router.post("/services", insertService);
router.delete("/services/api/records/:id", deleteService);

export default router;