import Database from "../db.js";

const db = new Database();

export const getAtendimentos = async (_, res) => {
    const q = "SELECT * FROM atendimentos";
    
    try {
        const data = await db.query(q); // Espera o resultado da query
        return res.status(200).json(data); // Envia os dados como resposta
    } catch (err) {
        return res.status(500).json(err); // Envia o erro como resposta
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
        const data = await db.query(q, params); // Insere os dados no banco
        return res.status(201).json(data[0]); // Retorna o registro adicionado
    } catch (err) {
        return res.status(500).json(err); // Envia o erro como resposta
    }
};