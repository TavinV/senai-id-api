import express from 'express'
import path from 'path'
import fs from 'fs'
import bodyParser from 'body-parser';
import json from 'body-parser';
import jwt from 'jsonwebtoken';
import multer from 'multer';

import { fileURLToPath } from 'url';

// Para utilizar o __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db_file_path = path.join(__dirname, '../db/users.json');

const router = express.Router()

function ler_dbJSON(res) {
    let users = []
    try {
        if (fs.existsSync(db_file_path)) {
            const file_data = fs.readFileSync(db_file_path, 'utf-8')
            users = JSON.parse(file_data)
        } else {
            throw ('Arquivo JSON não encontrado')
        }
    }
    catch (err) {
        return res.status(500).json({ msg: "Ocorreu um erro ao carregar o banco de dados", erro: err })
    }

    return users
}

router.get('/', (req, res) => {
    console.log('rota')
    const { login, senha } = req.query
    const users = ler_dbJSON(res)
    const conta = users.filter(user => user.senha === senha && user.login === login)

    if (conta.length > 0) {

        const secret = process.env.SECRET
        const token = jwt.sign({ id: conta[0].id }, secret, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'None' // Necessário para cross-origin
        })

        if (conta[0].adm === true) {
            return res.status(200).json({ url: `pages/register/register.html` });
        } else {
            return res.status(200).json({ url: `pages/access/carteirinha.html?id=${conta[0].id}` });
        }

    } else {
        res.status(401).json({ msg: "Login ou senha incorretos." })
    }

})

export default router;