import Database from "../db.js";

const db = new Database();

export const getServices = async (req, res) => {
    const q = "SELECT * FROM servicos";
    
    try {
        const data = await db.query(q); 
        return res.status(200).json(data); 
    } catch (err) {
        return res.status(500).json(err); 
    }
};

export const insertService = async (req, res) => {
    const { servico } = req.body;
    const q = `
        INSERT INTO servicos (servico)
        VALUES ($1) RETURNING *;
    `;
    const params = [servico];

    try {
        const data = await db.query(q, params);
        return res.status(201).json(data[0]); 
    } catch (err) {
        return res.status(500).json(err); 
    }
};

export const deleteService = async (req, res) => {
    const { id } = req.params;

    const q = "DELETE FROM servicos WHERE id = $1";

    try {
        const result = await db.query(q, [id]);

        if (result.rowCount === 0) {
            return res.status(404).send("Serviço não encontrado");
        }

        res.status(200).send("Serviço excluído com sucesso");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao excluir serviço");
    }
};
