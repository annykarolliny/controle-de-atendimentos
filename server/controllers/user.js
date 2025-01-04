import Database from "../db.js";

const db = new Database();

export const getAtendimentos = async (req, res) => {
    const q = "SELECT * FROM atendimentos";
    
    try {
        const data = await db.query(q); 
        return res.status(200).json(data); 
    } catch (err) {
        return res.status(500).json(err); 
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
        const data = await db.query(q, params);
        return res.status(201).json(data[0]); 
    } catch (err) {
        return res.status(500).json(err); 
    }
};

export const deleteAtendimento = async (req, res) => {
    const { id } = req.params;

    const q = "DELETE FROM atendimentos WHERE id = $1";

    try {
        const result = await db.query(q, [id]);

        if (result.rowCount === 0) {
            return res.status(404).send("Registro não encontrado");
        }

        res.status(200).send("Registro excluído com sucesso");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao excluir registro");
    }
};

export const updateAtendimento = async (req, res) => {
    const { id } = req.params;
    const { nome, sobrenome, telefone, servico, data, atendente } = req.body;

    const q = `
        UPDATE atendimentos 
        SET nome = $1, sobrenome = $2, telefone = $3, servico = $4, data = $5, atendente = $6
        WHERE id = $7 RETURNING *;
    `;
    const values = [nome, sobrenome, telefone, servico, data, atendente, id];

    try {
        const result = await db.query(q, values);

        if (result.rowCount === 0) {
            return res.status(404).send("Registro não encontrado");
        }

        // Retorna o atendimento atualizado para o frontend
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao atualizar registro");
    }
};


// export const updateAtendimento = async (req, res) => {
//     const { id } = req.params;
//     const { nome, sobrenome, telefone, servico, data, atendente } = req.body;

//     const q = `
//         UPDATE atendimentos SET nome = $1, sobrenome = $2, telefone = $3, servico = $4, data = $5, atendente = $6
//         WHERE id = $7 RETURNING *;
//     `;

//     const values = [nome, sobrenome, telefone, servico, data, atendente, id];

//     try {
//         const result = await db.query(q, values);

//         if (result.rowCount === 0) {
//             return res.status(404).send("Registro não encontrado");
//         }

//         res.status(200).send("Registro atualizado com sucesso");
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Erro ao atualizar registro");
//     }
// };
