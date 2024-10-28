import express from 'express'
import path from 'path'
import fs from 'fs'
// import bodyParser from 'body-parser';
// import { json } from 'body-parser';
import auth_jwt from '../middleware/auth_jwt.js'
import { fileURLToPath } from 'url';
import multer from 'multer';

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

router.get('/users/:id', (req, res) => {
    const users = ler_dbJSON(res);
    const id = parseInt(req.params.id)
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    const basePath = path.join(__dirname, '../db/fotos_perfil');
    const possibleExtensions = ['jpg', 'png', 'jpeg'];
    let profileImagePath;

    // Verifica cada extensão
    for (let ext of possibleExtensions) {
        const filePath = path.join(basePath, `${user.matricula}_pfp.${ext}`);
        if (fs.existsSync(filePath)) {
            profileImagePath = filePath;
            break;
        }
    }

    if (!profileImagePath) {
        return res.status(404).json({ msg: "Imagem de perfil não encontrada." });
    }

    // Envia a imagem como resposta

    res.status(200).json({ user });
    res.sendFile(profileImagePath);
})

export default router;
