import express from 'express'
import path from 'path'
import fs from 'fs'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import json from 'body-parser';
import jwt from 'jsonwebtoken';
import multer from 'multer';

import { fileURLToPath } from 'url';
import { log } from 'console';

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

router.post('/', (req, res) => {
    const { login, senha } = req.body;

    try {
        const users = ler_dbJSON();
        const conta = users.filter(user => user.senha === senha && user.login === login);

        if (conta.length > 0) {
            const contaVerificada = conta[0]
            // const secret = process.env.SECRET;
            const secret = "projetosenaiidtccsquadrado2025";
            const token = jwt.sign({ id: contaVerificada.id }, secret, { expiresIn: "7d" });

            const responseUrl = contaVerificada.adm === true ? "pages/register/register.html" : `pages/access/carteirinha.html`;
            return res.status(200).json({ url: responseUrl, token: token });

        } else {
            console.log('Login ou senha incorretos')
            return res.status(401).json({ msg: "Login ou senha incorretos." });
        }
    } catch (err) {
        return res.status(500).json({ msg: "Ocorreu um erro ao carregar o banco de dados", erro: err.message });
    }
});

export default router;