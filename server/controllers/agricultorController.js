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

export const updateAgricultor = async (req, res) => {
    const { telefone } = req.params;
    const { nome, sobrenome, novoTelefone } = req.body;

    if (!nome || !sobrenome || !novoTelefone) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const q = `
        UPDATE agricultores
        SET nome = $1, sobrenome = $2, telefone = $3
        WHERE telefone = $4 RETURNING *;
    `;
    const params = [nome, sobrenome, novoTelefone, telefone];

    try {
        const data = await db.query(q, params);

        if (data.rowCount === 0) {
            return res.status(404).json({ message: 'Agricultor não encontrado.' });
        }

        return res.status(200).json(data.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao atualizar agricultor', error: err.message });
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

