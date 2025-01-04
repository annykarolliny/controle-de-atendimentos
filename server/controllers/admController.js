import Database from "../db.js";

const db = new Database();

export const getAdms = async (req, res) => {
    const q = "SELECT * FROM adm";
    
    try {
        const data = await db.query(q); 
        return res.status(200).json(data); 
    } catch (err) {
        return res.status(500).json(err); 
    }
};

export const insertAdm = async (req, res) => {
    const { nome, cpf } = req.body;
    const q = `
        INSERT INTO adm (nome, cpf)
        VALUES ($1, $2) RETURNING *;
    `;
    const params = [nome, cpf];

    try {
        const data = await db.query(q, params);
        return res.status(201).json(data[0]); 
    } catch (err) {
        return res.status(500).json(err); 
    }
};

export const deleteAdm = async (req, res) => {
    const { cpf } = req.params;

    const q = "DELETE FROM adm WHERE cpf = $1";

    try {
        const result = await db.query(q, [cpf]);

        if (result.rowCount === 0) {
            return res.status(404).send("Registro não encontrado");
        }

        res.status(200).send("Registro excluído com sucesso");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao excluir registro");
    }
};
