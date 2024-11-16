import express, { response } from 'express'
import path from 'path'
import fs from 'fs'
import jwt from "jsonwebtoken";
import { fileURLToPath } from 'url';
import multer from 'multer';

// Para utilizar o __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db_file_path = path.join(__dirname, '../db/users.json');

const router = express.Router()


function ler_dbJSON() {
    let users = [];
    try {
        if (fs.existsSync(db_file_path)) {
            const file_data = fs.readFileSync(db_file_path, 'utf-8');
            users = JSON.parse(file_data);
        } else {
            throw new Error('Arquivo JSON não encontrado');
        }
    } catch (err) {
        throw err; // Lança o erro para que a rota possa lidar com ele
    }

    return users;
}

router.get('/', (req, res) =>{
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1]
    // const secret = process.env.SECRET;
    const secret = "projetosenaiidtccsquadrado2025";
    let id = null

    if (!token) {
        return response.status(400).json({ msg: "Token não fornecido." });
    }

    // Verificando o token
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: "Token inválido" })
        }
        id = decoded.id

        const users = ler_dbJSON()
        const user = users.find(u => u.id === id);

        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado." })
        }else {
            const responseUrl = user.adm === true ? "pages/register/register.html" : `pages/access/carteirinha.html`;
            return res.status(200).json({ url: responseUrl, token: token });
        }
    })

    
})

export default router;
