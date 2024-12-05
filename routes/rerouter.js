import express from 'express'
import jwt from 'jsonwebtoken';

const router = express.Router()

// Rota executada ao entrar em qualquer página, imediatamente redireciona o usuário caso Não tenha as permissões adequadas.
router.get('/', (req, res) => {
    // Buscar o ID do usuário com base em seu token

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(400).json({ msg: "Token não fornecido." });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(400).json({ msg: "Token não fornecido." });
    }

    const secret = process.env.SECRET || 'produção';

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: "Token inválido." });
        }

        const cargo = decoded.cargo;
        return res.status(200).json({ cargo })
    });
})

export default router;
