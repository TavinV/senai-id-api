import express, { response } from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import multer from 'multer';
import * as dbMng from '../modules/database_manager.js' // Módulo que cuida da base de dados ficitícia
import validarToken from '../middleware/auth_jwt.js'; // Middleware para verificar as permições com JWT

// Para utilizar o __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Registra novos alunos, validando as permissões com JWT e enviando a sua foto na pasta através do multer.
router.post(
    '/registrar/aluno',
    validarToken(true), // Primeiro valida o token
    upload.single('foto_perfil'), // Só processa o upload após a validação
    async (req, res) => {

        const { nome, rg, login, senha, cargo, curso, data_nascimento, matricula } = req.body;
        const requiredFields = { nome, rg, login, senha, curso, data_nascimento, matricula };
        const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Campos obrigatórios ausentes: ${missingFields.join(", ")}`
            });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Campo obrigatório ausente: foto_perfil" });
        }

        try {
            await dbMng.registrarAluno(
                nome,
                rg,
                login,
                senha,
                cargo,
                curso,
                matricula,
                data_nascimento,
                req.file.filename
            );
            return res.status(201).json({ msg: "Usuário registrado com sucesso." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Erro ao registrar aluno." });
        }
    }
);

// Busca as informações do usuário que está loggado na conta com base no token que é enviado.
router.get('/user/me', validarToken(true), (req, res) => {
    const decodedInfo = req.decoded;

    if (!decodedInfo) {
        return res.status(404).json({ msg: "Usuario não encontrado." })
    } else {
        const user = dbMng.procurarUsuarioKey({ id: decodedInfo.id })

        if (user) {
            return res.status(200).json({ user })
        } else {
            return res.status(404).json({ msg: "Usuário não encontrado." })
        }
    }
})


export default router;