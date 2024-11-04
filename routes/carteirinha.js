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


router.get('/users/', (req, res) => {
    console.log("\n\n\n\n----------------------/CARTEIRINHA/USERS/:ID/---------------------------------")
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1]
    const secret = process.env.SECRET;
    let id = null

    if (!token) {
        return response.status(400).json({ msg: "Token não fornecido." });
    }

    // Verificando o token
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log('erro')
            return res.status(403).json({ msg: "Token inválido" })
        }
        id = decoded.id
    })


    console.log(id)
    const users = ler_dbJSON()
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ msg: "" });
    }


    console.log("-----------------------/CARTEIRINHA/USERS/:ID/---------------------------------")
    return res.status(200).json({ user });
})

router.get('/userfotoperfil/', (req, res) => {
    console.log('\n\n\n-------------------------------/CARTEIRINHA/USERS/PFP/:ID/----------------------------------------\n\n\n')
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1]
    const secret = process.env.SECRET;
    let id = null

    if (!token) {
        return response.status(400).json({ msg: "Token não fornecido." });
    }

    // Verificando o token
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log('erro')
            return res.status(403).json({ msg: "Token inválido" })
        }
        id = decoded.id
    })

    const users = ler_dbJSON()
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado." })
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
    console.log('\n\n\n-------------------------------/CARTEIRINHA/USERS/PFP/:ID/----------------------------------------\n\n\n')
    return res.sendFile(profileImagePath);
})

export default router;
