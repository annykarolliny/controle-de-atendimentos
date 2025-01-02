import Database from "../db.js";

const db = new Database();

export const getAtendimentos = async (_, res) => {
    const q = "SELECT * FROM atendimentos";
    
    try {
        const data = await db.query(q); 
        return res.status(200).json(data); 
    } catch (err) {
        return res.status(500).json(err); 
    }
};

export const createAtendimento = async (req, res) => {
    const { nome, sobrenome, telefone, servico, data, atendente } = req.body;
    const q = `
        INSERT INTO atendimentos (nome, sobrenome, telefone, servico, data, atendente)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const params = [nome, sobrenome, telefone, servico, data, atendente];

    try {
        const data = await db.query(q, params);
        return res.status(201).json(data[0]); 
    } catch (err) {
        return res.status(500).json(err); 
    }
};