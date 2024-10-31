import express from 'express'
import path from 'path'
import fs from 'fs'
// import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import multer from 'multer';
// import { json } from 'body-parser';

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
        const matricula = req.body.matricula;
        if (!matricula) {
            return cb(new Error("Matrícula é necessária para nomear o arquivo"));
        }
        cb(null, `${matricula}_pfp${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

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

router.post('/registrar', upload.single('foto_perfil'), (req, res) => {
    const { nome, rg, login, senha, adm, curso, data_nascimento, matricula } = req.body;
    const requiredFields = { nome, rg, login, senha, adm, curso, data_nascimento, matricula };
    const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);

    console.log(req.body)
    if (missingFields.length > 0) {
        console.log(missingFields)
        return res.status(400).json({
            error: `Campos obrigatórios ausentes: ${missingFields.join(", ")}`
        });
    }
    if (!req.file) {
        return res.status(400).json({ error: "Campo obrigatório ausente: foto_perfil" });
    }

    let users = ler_dbJSON()

    const newUser = {
        id: users.length + 1,
        nome,
        rg,
        foto_perfil: req.file.filename,
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

    console.log("Usuário registrado com sucesso", newUser)
    res.status(201).json({ message: "Usuário registrado com sucesso", user: newUser });

});

// Retorna usuários administradores
router.get('/', (req, res) => {
    let users = ler_dbJSON()
    let adm = users.filter(user => user.adm === true)

    res.status(200).json(adm)
})

router.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id)

    let users = ler_dbJSON()
    let usuario_procurado = users.filter(user => user.id === id)

    if (!usuario_procurado) {
        return res.status(404)
    }
    return res.status(200).json(usuario_procurado)
})


export default router;