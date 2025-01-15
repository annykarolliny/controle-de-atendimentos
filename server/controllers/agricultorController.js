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

// export const deleteAgricultor = async (req, res) => {
//     const { telefone } = req.params;

//     console.log(`Tentando excluir agricultor com telefone: ${telefone}`);

//     // Verificar se o agricultor tem atendimentos associados
//     const checkQuery = `
//         SELECT * FROM atendimentos WHERE telefone = $1;
//     `;
//     try {
//         const checkResult = await db.query(checkQuery, [telefone]);

//         console.log(`Resultado da verificação:`, checkResult.rows);  
//         console.log(`Resultado da verificação:`, Object.keys(checkResult));  
//         console.log(`Resultado da rowCount:`, checkResult.rowCount);
//         console.log('Tipo de retorno do db.query:', checkResult);


//         if (checkResult.rows > 0) {
//             // Se o agricultor tem atendimentos associados, não pode ser excluído
//             console.log(`Agricultor com telefone ${telefone} está associado a atendimentos. Exclusão bloqueada.`);
//             return res.status(400).send('O agricultor não pode ser excluído pois está associado a atendimentos.');
//         }

//         console.log(`Agricultor com telefone ${telefone} não tem atendimentos associados. Continuando com a exclusão...`);

//         // Caso não tenha atendimentos, proceder com a exclusão
//         const q = 'DELETE FROM agricultor WHERE telefone = $1';
//         const result = await db.query(q, [telefone]);

//         if (result.rowCount === 0) {
//             console.log(`Nenhum agricultor encontrado com o telefone ${telefone}`);
//             return res.status(404).send('Agricultor não encontrado');
//         }

//         console.log(`Agricultor com telefone ${telefone} excluído com sucesso.`);
//         res.status(200).send('Agricultor excluído com sucesso');
//     } catch (err) {
//         console.error('Erro ao excluir agricultor:', err);
//         res.status(500).send('Erro ao excluir agricultor');
//     }
// };

