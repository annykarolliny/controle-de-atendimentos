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

// export const insertAdm = async (req, res) => {
//     const { nome, cpf } = req.body;
//     const q = `
//         INSERT INTO adm (nome, cpf)
//         VALUES ($1, $2) RETURNING *;
//     `;
//     const params = [nome, cpf];

//     try {
//         const { rows } = await db.query(q, params);
//         return res.status(201).json(rows[0]); // Retorna o registro criado
//     } catch (err) {
//         // Verifica se o erro é de violação da restrição UNIQUE
//         if (err.code === '23505') {
//             return res.status(400).json({ 
//                 message: "CPF já está cadastrado.",
//                 field: "cpf"
//             });
//         }
//         // Lida com outros erros
//         return res.status(500).json({ 
//             message: "Erro no servidor.",
//             error: err.message
//         });
//     }
// };


export const insertAdm = async (req, res) => {
    const { nome, cpf } = req.body;

    if (!cpf) {
        return res.status(400).json({ message: "CPF é obrigatório." });
    }

    const q = `
        INSERT INTO adm (nome, cpf)
        VALUES ($1, $2) RETURNING *;
    `;
    const params = [nome, cpf];

    try {
        const data = await db.query(q, params);
        return res.status(201).json(data[0]); 
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ message: "O CPF já está cadastrado." });
        }
        
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
