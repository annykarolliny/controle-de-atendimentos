import Database from '../db.js';

const db = new Database();

export const getAtendimentos = async (req, res) => {
    const q = 'SELECT * FROM atendimentos';
    
    try {
        const data = await db.query(q); 
        return res.status(200).json(data); 
    } catch (err) {
        return res.status(500).json(err); 
    }
};

export const getAtendimentoById = async (req, res) => {
    const { id } = req.params;

    try {
        const atendimento = await db.query('SELECT * FROM atendimentos WHERE id = $1', [id]);

        if (atendimento.length === 0) {
            return res.status(404).json({ message: 'Atendimento não encontrado.' });
        }

        res.status(200).json(atendimento[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar atendimento.' });
    }
};

export const insertAtendimento = async (req, res) => {
    const { nome, sobrenome, telefone, servico, data, atendente } = req.body;

    const queryCheck = `
        SELECT * FROM atendimentos 
        WHERE nome = $1 AND sobrenome = $2 AND telefone = $3 AND servico = $4 AND data = $5 AND atendente = $6;
    `;
    const paramsCheck = [nome, sobrenome, telefone, servico, new Date(data), atendente];

    try {
        const existingAtendimento = await db.query(queryCheck, paramsCheck);

        if (existingAtendimento.length > 0) {
            return res.status(400).json({
                error: 'Atendimento já existe para essa data!',
            });
        }

        const q = `
            INSERT INTO atendimentos (nome, sobrenome, telefone, servico, data, atendente)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;
        const params = [nome, sobrenome, telefone, servico, data, atendente];
        const dado = await db.query(q, params);

        return res.status(201).json(dado[0]);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const updateAtendimento = async (req, res) => {
    const { id } = req.params;
    const { nome, sobrenome, telefone, servico, data, atendente } = req.body;

    const q = `
        UPDATE atendimentos
        SET nome = $1, sobrenome = $2, telefone = $3, servico = $4, data = $5, atendente = $6
        WHERE id = $7
        RETURNING *;
    `;
    const params = [nome, sobrenome, telefone, servico, data, atendente, id];

    try {
        const updatedAtendimento = await db.query(q, params);

        if (updatedAtendimento.length === 0) {
            return res.status(404).json({ message: 'Atendimento não encontrado.' });
        }

        res.status(200).json(updatedAtendimento[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar atendimento.' });
    }
};

export const deleteAtendimento = async (req, res) => {
    const { id } = req.params;

    const q = 'DELETE FROM atendimentos WHERE id = $1';

    try {
        const result = await db.query(q, [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Atendimento não encontrado');
        }

        res.status(200).send('Atendimento excluído com sucesso');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao excluir atendimento');
    }
};

export const confirmPassword = async (req, res) => {
    const { cpf, senha } = req.body;

    try {
        const admin = await db.query('SELECT senha FROM adm WHERE cpf = $1', [cpf]);

        if (!admin ) {
            return res.status(400).json({ message: 'Senha incorreta' });
        }

        if(senha != admin[0].senha)
            return res.status(400).json({ message: 'Senha incorreta' });

        return res.status(200).json({ message: 'Senha correta' });
    } catch (err) {
        console.error('Erro ao validar a senha:', err);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}