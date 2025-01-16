import Database from '../db.js';

const db = new Database();

export const getAgricultores = async (req, res) => {
    const q = 'SELECT * FROM agricultor';
    
    try {
        const data = await db.query(q); 
        return res.status(200).json(data); 
    } catch (err) {
        return res.status(500).json(err); 
    }
};

export const insertAgricultor = async (req, res) => {
    const { nome, sobrenome, telefone } = req.body;

    try {
        const insertQuery = `
            INSERT INTO agricultor (nome, sobrenome, telefone)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const insertParams = [nome, sobrenome, telefone];
        const insertResult = await db.query(insertQuery, insertParams);

        return res.status(201).json(insertResult.rows[0]);
    } catch (err) {
        return res.status(500).json(err);
    }
};

export const deleteAgricultor = async (req, res) => {
    const { telefone } = req.params;

    const q = 'DELETE FROM agricultor WHERE telefone = $1';

    try {
        const result = await db.query(q, [telefone]);

        if (result.rowCount === 0) {
            return res.status(404).send('Agricultor não encontrado');
        }

        res.status(200).send('Agricultor excluído com sucesso');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao excluir agricultor');
    }
};
