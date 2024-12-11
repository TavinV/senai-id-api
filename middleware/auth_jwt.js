import jwt from "jsonwebtoken";

// Middleware para verificar a validade de um Token JWT, e pode verificar permissões.
const validarToken = (verificarCargo = false) => (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(400).json({ msg: "Token não fornecido." });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(400).json({ msg: "Token não fornecido." });
    }
    const secret = process.env.SECRET  || 'produção'

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: "Token inválido." });
        }

        if (verificarCargo && decoded.cargo !== 'secretaria') {
            return res.status(403).json({ msg: "Você não tem permissão para realizar essa ação." });
        }

        req.decoded = decoded; // Passa o token decodificado para os próximos middlewares
        next();
    });
};

export default validarToken;
