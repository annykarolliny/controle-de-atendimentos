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

    // Query para verificar se o agricultor já existe
    const checkQuery = `
        SELECT * FROM agricultor
        WHERE nome = $1 AND sobrenome = $2 AND telefone = $3;
    `;
    const checkParams = [nome, sobrenome, telefone];

    try {
        // Verifica se o agricultor já existe
        const checkResult = await db.query(checkQuery, checkParams);

        if (checkResult.rowCount > 0) {
            // Agricultor já existe, retorna os dados encontrados
            return res.status(200).json(checkResult.rows[0]);
        }

        // Caso não exista, insere o agricultor
        const insertQuery = `
            INSERT INTO agricultor (nome, sobrenome, telefone)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const insertParams = [nome, sobrenome, telefone];
        const insertResult = await db.query(insertQuery, insertParams);

        return res.status(201).json(insertResult.rows[0]);
    } catch (err) {
        console.error(err);

        if (err.code === '23505') {
            return res.status(400).json({ message: 'O agricultor já está cadastrado.' });
        }

        return res.status(500).json(err);
    }
};


// export const insertAgricultor = async (req, res) => {
//     const { nome, sobrenome, telefone } = req.body;

//     const q = `
//         INSERT INTO agricultor (nome, sobrenome, telefone)
//         VALUES ($1, $2, $3) RETURNING *;
//     `;
//     const params = [nome, sobrenome, telefone];

//     try {
//         const data = await db.query(q, params);
//         return res.status(201).json(data[0]); 
//     } catch (err) {
//         if (err.code === '23505') {
//             return res.status(400).json({ message: 'O agricultor já está cadastrado.' });
//         }
        
//         return res.status(500).json(err); 
//     }
// };

// export const deleteAgricultor = async (req, res) => {
//     const { telefone } = req.params;

//     const atendimentosCheck = `
//         SELECT * FROM atendimentos WHERE telefone = $1;
//     `;

//     try {
//         // Verifica se o agricultor tem registros na tabela de atendimentos
//         const atendimentos = await db.query(atendimentosCheck, [telefone]);

//         if (atendimentos.rowCount > 0) {
//             return res.status(400).send('Não é possível excluir o agricultor. Existem registros na tabela de atendimentos.');
//         }

//         // Exclui o agricultor se não houver atendimentos associados
//         const excluirAgricultor = `
//             DELETE FROM agricultor WHERE telefone = $1;
//         `;

//         const result = await db.query(excluirAgricultor, [telefone]);

//         if (result.rowCount === 0) {
//             return res.status(404).send('Agricultor não encontrado.');
//         }

//         return res.status(200).send('Agricultor excluído com sucesso.');
//     } catch (error) {
//         console.error('Erro ao excluir agricultor:', error);
//         res.status(500).send('Erro interno do servidor.');
//     }
// }

// export const deleteAgricultor = async (req, res) => {
//     const { telefone } = req.params;

//     // Verifica se o agricultor está associado a algum atendimento
//     const checkQuery = `
//         SELECT 1 FROM atendimentos 
//         WHERE telefone = $1 LIMIT 1;
//     `;

//     // Query para deletar o agricultor
//     const deleteQuery = `
//         DELETE FROM agricultor 
//         WHERE telefone = $1;
//     `;

//     try {
//         // Verifica se há atendimentos relacionados ao agricultor
//         const checkResult = await db.query(checkQuery, [telefone]);

//         if (checkResult.rowCount > 0) {
//             return res.status(400).json({ 
//                 message: 'Não é possível excluir. Existem atendimentos associados a este agricultor.' 
//             });
//         } else {
//             // Deleta o agricultor se não houver atendimentos associados
//             const deleteResult = await db.query(deleteQuery, [telefone]);

//             if (deleteResult.rowCount === 0) {
//                 return res.status(404).json({ message: 'Agricultor não encontrado.' });
//             }

//             res.status(200).json({ message: 'Agricultor excluído com sucesso.' });
//         }

//         // // Deleta o agricultor se não houver atendimentos associados
//         // const deleteResult = await db.query(deleteQuery, [telefone]);

//         // if (deleteResult.rowCount === 0) {
//         //     return res.status(404).json({ message: 'Agricultor não encontrado.' });
//         // }

//         // res.status(200).json({ message: 'Agricultor excluído com sucesso.' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Erro ao excluir agricultor.' });
//     }
// };


// export const deleteAgricultor = async (req, res) => {
//     const { telefone } = req.params;

//     const q = 'DELETE FROM agricultor WHERE telefone = $1';

//     try {
//         const result = await db.query(q, [telefone]);

//         if (result.rowCount === 0) {
//             return res.status(404).send('Agricultor não encontrado');
//         }

//         res.status(200).send('Agricultor excluído com sucesso');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Erro ao excluir agricultor');
//     }
// };

export const deleteAgricultor = async (req, res) => {
    const { telefone } = req.params;

    console.log(`Tentando excluir agricultor com telefone: ${telefone}`);

    // Verificar se o agricultor tem atendimentos associados
    const checkQuery = `
        SELECT * FROM atendimentos WHERE telefone = $1;
    `;
    try {
        const checkResult = await db.query(checkQuery, [telefone]);

        console.log(`Resultado da verificação:`, checkResult.rows);  
        console.log(`Resultado da verificação:`, Object.keys(checkResult));  
        console.log(`Resultado da rowCount:`, checkResult.rowCount);
        console.log('Tipo de retorno do db.query:', checkResult);


        if (checkResult.rows > 0) {
            // Se o agricultor tem atendimentos associados, não pode ser excluído
            console.log(`Agricultor com telefone ${telefone} está associado a atendimentos. Exclusão bloqueada.`);
            return res.status(400).send('O agricultor não pode ser excluído pois está associado a atendimentos.');
        }

        console.log(`Agricultor com telefone ${telefone} não tem atendimentos associados. Continuando com a exclusão...`);

        // Caso não tenha atendimentos, proceder com a exclusão
        const q = 'DELETE FROM agricultor WHERE telefone = $1';
        const result = await db.query(q, [telefone]);

        if (result.rowCount === 0) {
            console.log(`Nenhum agricultor encontrado com o telefone ${telefone}`);
            return res.status(404).send('Agricultor não encontrado');
        }

        console.log(`Agricultor com telefone ${telefone} excluído com sucesso.`);
        res.status(200).send('Agricultor excluído com sucesso');
    } catch (err) {
        console.error('Erro ao excluir agricultor:', err);
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
//         console.log(`Quantidade de atendimentos encontrados:`, checkResult.rows.length);

//         if (checkResult.rows.length > 0) {
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

