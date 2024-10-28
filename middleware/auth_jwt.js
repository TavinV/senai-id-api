import jwt from "jsonwebtoken";

const auth_jwt = (req, res, next) => {
    const token = req.cookies.token;
    console.log('-----------------Autenticando--------------------');

    if (!token) {
        console.log('Token não existe.');
        return res.status(401).json({ msg: "Acesso negado." });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.userId = decoded.id; // Anexa o ID do usuário ao objeto req
        console.log(`Usuário autenticado: ${req.userId}`);
        next();
    } catch (error) {
        console.log('Token inválido ou expirado');
        return res.status(403).json({ msg: "Token inválido ou expirado." });
    }

    console.log('-----------------Autenticando--------------------');
}

export default auth_jwt;