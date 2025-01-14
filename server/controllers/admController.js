import Database from '../db.js';
// import bcrypt from 'bcrypt';

const db = new Database();

export const getAdms = async (req, res) => {
    const q = 'SELECT * FROM adm';
    
    try {
        const data = await db.query(q); 
        return res.status(200).json(data); 
    } catch (err) {
        return res.status(500).json(err); 
    }
};

export const insertAdm = async (req, res) => {
    const { nome, cpf, senha } = req.body;

    if (!nome || !cpf || !senha) {
        return res.status(400).json({ message: 'Todos os dados são obrigatórios.' });
    }

    // const saltRounds = 10; // Define o custo do hash
    // const hashedSenha = await bcrypt.hash(senha, saltRounds);

    const q = `
        INSERT INTO adm (nome, cpf,senha)
        VALUES ($1, $2, $3) RETURNING *;
    `;
    const params = [nome, cpf, senha];

    try {
        const data = await db.query(q, params);
        return res.status(201).json(data[0]); 
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ message: 'O administrador já está cadastrado.' });
        }
        
        return res.status(500).json(err); 
    }
};

export const deleteAdm = async (req, res) => {
    const { cpf } = req.params;

    const q = 'DELETE FROM adm WHERE cpf = $1';

    try {
        const result = await db.query(q, [cpf]);

        if (result.rowCount === 0) {
            return res.status(404).send('Administrador não encontrado');
        }

        res.status(200).send('Administrador excluído com sucesso');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao excluir administrador');
    }
};
