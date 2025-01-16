import Database from '../db.js';

const db = new Database();

export const getServices = async (req, res) => {
    const q = 'SELECT * FROM servicos';
    
    try {
        const data = await db.query(q); 
        return res.status(200).json(data); 
    } catch (err) {
        return res.status(500).json(err); 
    }
};

export const getServiceById = async (req, res) => {
    const { id } = req.params;
    const q = 'SELECT * FROM servicos WHERE id = $1';

    try {
        const data = await db.query(q, [id]);

        if (data.length === 0) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }

        return res.status(200).json(data[0]);
    } catch (err) {
        return res.status(500).json({ message: 'Erro no servidor', error: err.message });
    }
};

export const insertService = async (req, res) => {
    const { servico } = req.body;

    if (!servico || servico.trim() === '') {
        return res.status(400).json({ message: 'O nome do serviço é obrigatório.' });
    }

    const q = `
        INSERT INTO servicos (servico)
        VALUES ($1) RETURNING *;
    `;
    const params = [servico];

    try {
        const data = await db.query(q, params);
        return res.status(201).json(data[0]); // Retorna o serviço criado
    } catch (err) {
        if (err.code === '23505') { // Código de erro para chave única no Postgres
            return res.status(400).json({ message: 'O serviço já está cadastrado.' });
        }
        return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
    }
};

export const updateService = async (req, res) => {
    const { id } = req.params;
    const { servico } = req.body;  // Valor para atualização

    if (!servico || servico.trim() === '') {
        return res.status(400).json({ message: 'O nome do serviço é obrigatório.' });
    }

    const q = 'UPDATE servicos SET servico = $1 WHERE id = $2 RETURNING *';

    try {
        const data = await db.query(q, [servico, id]);

        if (data.length === 0) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }

        return res.status(200).json(data[0]);  // Retorna o serviço atualizado
    } catch (err) {
        console.error('Erro ao atualizar serviço:', err);  // Exibe erro no servidor
        return res.status(500).json({ message: 'Erro ao atualizar o serviço', error: err.message });
    }
};

export const deleteService = async (req, res) => {
    const { id } = req.params;

    const q = 'DELETE FROM servicos WHERE id = $1';

    try {
        const result = await db.query(q, [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Serviço não encontrado');
        }

        res.status(200).send('Serviço excluído com sucesso');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao excluir serviço');
    }
};
