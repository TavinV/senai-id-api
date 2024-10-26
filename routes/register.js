import express from 'express'
import path from 'path'
import fs from 'fs'
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Para utilizar o __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db_file_path = path.join(__dirname, '../db/users.json');

const router = express.Router()

// Configurando o Multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../db/fotos_perfil'))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_pfp_' + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

router.post('/', upload.single('foto_perfil'), (req, res) => {

    const { nome, rg, foto_perfil, login, senha, adm, curso, data_nascimento, matricula } = req.body;
    const requiredFields = { nome, rg, login, senha, adm, curso, data_nascimento, matricula, foto_perfil };
    const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);

    console.log(req.body)
    if (missingFields.length > 0) {
        console.log(missingFields)
        return res.status(400).json({
            error: `Campos obrigatórios ausentes: ${missingFields.join(", ")}`
        });
    }

    let users = [];

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

    const newUser = {
        id: users.length + 1,
        nome,
        rg,
        foto_perfil: 'foto',
        login,
        senha,
        adm,
        curso,
        matricula,
        data_nascimento
    };

    // Adiciona o usuário ao JSON e responde com sucesso
    users.push(newUser);
    fs.writeFileSync(db_file_path, JSON.stringify(users, null, 2));
    res.status(201).json({ message: "Usuário registrado com sucesso", user: newUser });

});



export default router;