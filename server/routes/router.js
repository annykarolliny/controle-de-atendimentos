import express from 'express';
import { getAtendimentos, insertAtendimento, deleteAtendimento, updateAtendimento } from '../controllers/user.js';
import { deleteAdm, getAdms, insertAdm } from '../controllers/admController.js';
import { deleteService, getServices, insertService } from '../controllers/servicesController.js';
import { deleteAgricultor, getAgricultores, insertAgricultor } from '../controllers/agricultorController.js'

const router = express.Router();

// Rotas de atendimentos

router.post('/atendimentos', insertAtendimento);
router.get('/atendimentos', getAtendimentos);
router.delete('/atendimentos/:id', deleteAtendimento);
router.put('/atendimentos/:id', updateAtendimento);

// Rotas de administradores

router.get('/adms', getAdms);
router.post('/adms', insertAdm);
router.delete('/adms/:cpf', deleteAdm);

// Rotas para serviços

router.get('/services', getServices);
router.post('/services', insertService);
router.delete('/services/:id', deleteService);

// Rotas para agricultores

router.get('/agricultores', getAgricultores);
router.post('/agricultores', insertAgricultor);
router.delete('/agricultores/:telefone', deleteAgricultor);

export default router;