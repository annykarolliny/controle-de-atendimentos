import express from 'express';
import { getAtendimentos, getAtendimentoById, insertAtendimento, updateAtendimento, deleteAtendimento, confirmPassword } from '../controllers/indexController.js';
import { getAdms, getAdmByCpf, insertAdm, updateAdm, deleteAdm } from '../controllers/admController.js';
import { getServices, getServiceById, insertService, updateService, deleteService } from '../controllers/servicesController.js';
import { getAgricultores, insertAgricultor, updateAgricultor, deleteAgricultor } from '../controllers/agricultorController.js'

const router = express.Router();

// Rotas de atendimentos
router.post('/atendimentos', insertAtendimento);
router.get('/atendimentos/:id', getAtendimentoById);
router.get('/atendimentos', getAtendimentos);
router.delete('/atendimentos/:id', deleteAtendimento);
router.put('/atendimentos/:id', updateAtendimento);

// Rotas de administradores
router.get('/adms/:cpf', getAdmByCpf);
router.get('/adms', getAdms);
router.post('/adms/validate-password', confirmPassword);
router.post('/adms', insertAdm);
router.put('/adms/:cpf', updateAdm);
router.delete('/adms/:cpf', deleteAdm);

// Rotas para serviços
router.get('/services/:id', getServiceById);
router.get('/services', getServices);
router.post('/services', insertService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Rotas para agricultores
router.get('/agricultores', getAgricultores);
router.post('/agricultores', insertAgricultor);
router.put('/agricultores/:telefone', updateAgricultor);
router.delete('/agricultores/:telefone', deleteAgricultor);

export default router;