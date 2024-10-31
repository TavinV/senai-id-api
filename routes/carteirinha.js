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


router.get('/users/:id', (req, res) => {
    console.log("\n\n\n\n----------------------/CARTEIRINHA/USERS/:ID/---------------------------------")
    console.log("Cookies: ", req.cookies)

    const users = ler_dbJSON()
    const id = parseInt(req.params.id)
    const user = users.find(u => u.id === id);
    
    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
    }
    
    
    // Envia a imagem como resposta
    
    return res.status(200).json({ user });
    console.log("-----------------------/CARTEIRINHA/USERS/:ID/---------------------------------")
})

router.get('/userfotoperfil/:id', (req, res) => {
    console.log('\n\n\n-------------------------------/CARTEIRINHA/USERS/PFP/:ID/----------------------------------------\n\n\n')
    const users = ler_dbJSON()
    const id = parseInt(req.params.id)
    const user = users.find(u => u.id === id);
    
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
    return res.sendFile(profileImagePath);
    console.log('\n\n\n-------------------------------/CARTEIRINHA/USERS/PFP/:ID/----------------------------------------\n\n\n')
})

export default router;
