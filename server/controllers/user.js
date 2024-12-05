import Database from "../db.js";

export const getAtendimentos = async (_, res) => {
    const q = "SELECT * FROM atendimentos";
    const db = new Database();

    try {
        const data = await db.query(q); // Espera o resultado da query
        return res.status(200).json(data); // Envia os dados como resposta
    } catch (err) {
        return res.status(500).json(err); // Envia o erro como resposta
    }
};