import express, { response } from 'express'

// Modulos Node
import path from 'path'
import { fileURLToPath } from 'url';
import multer from 'multer';
import moment from 'moment';
import { console } from 'inspector';

// Modulos

import { delayManager } from '../modules/student_delay_manager.js'
import { userManager } from '../modules/user_manager.js';

// Middleware
import validarToken from '../middleware/auth_jwt.js'; // Middleware para verificar as permições com JWT

// Schemas
import { verificarAluno } from '../schemas/schemas.js'
import { verificarFuncionario } from '../schemas/schemas.js'


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
        const chavePrimaria = req.body.matricula || req.body.nif;
        if (!chavePrimaria) {
            return cb(new Error("Matrícula é necessária para nomear o arquivo"));
        }
        cb(null, `${chavePrimaria}_pfp${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

/* ---------------------------------------------------------


    ROTAS


------------------------------------------------------------*/



// Busca as informações do usuário que está loggado na conta com base no token que é enviado.
router.get('/user/me', validarToken(true), (req, res) => {
    const decodedInfo = req.decoded;

    if (!decodedInfo) {
        return res.status(404).json({ msg: "Usuario não encontrado." })
    } else {
        const id = decodedInfo.id
        const user = userManager.findUserByKey({ id: id })


        if (user) {
            return res.status(200).json({ user })
        } else {
            return res.status(404).json({ msg: "Usuário não encontrado." })
        }
    }
})

// Registra novos alunos, validando as permissões com JWT e enviando a sua foto na pasta através do multer.
router.post(
    '/registrar/aluno',
    validarToken(true), // Primeiro valida o token
    upload.single('foto_perfil'), // Só processa o upload após a validação
    async (req, res) => {

        const aluno = req.body;
        const [statusVerificacao, message] = verificarAluno(aluno)

        if (!req.file) {
            return res.status(400).json({ error: "Campo obrigatório ausente: foto_perfil" });
        }

        if (statusVerificacao != 200) {
            return res.status(400).json({ message })
        }
        else {
            try {
                aluno.foto = req.file.filename

                userManager.registerUser(aluno);
                return res.status(201).json({ msg: "Usuário registrado com sucesso." });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ msg: `Erro ao registrar aluno. ${error}` });
            }
        }
    }
);

// Registra novos alunos, validando as permissões com JWT e enviando a sua foto na pasta através do multer.
router.post(
    '/registrar/funcionario',
    validarToken(true), // Primeiro valida o token
    upload.single('foto_perfil'), // Só processa o upload após a validação
    async (req, res) => {

        const funcionario = req.body
        const [statusVerificacao, message] = verificarFuncionario(funcionario)

        if (!req.file) {
            return res.status(400).json({ error: "Campo obrigatório ausente: foto_perfil" });
        }

        if (statusVerificacao != 200) {
            return res.status(400).json({ message })
        } else {
            try {
                funcionario.foto = req.file.filename
                userManager.registerUser(funcionario);

                return res.status(201).json({ msg: "Funcionário registrado com sucesso." });
            } catch (error) {
                return res.status(500).json({ msg: `Erro ao registrar funcionário. ${error}` });
            }
        }
    }
);

router.post('/users/validaratraso/:idatraso', validarToken(true), async (req, res) => {
    const id_atraso = req.params.idatraso;
    const { responsavel, professor, motivo } = req.body

    const data = moment().format('l')
    const horario = moment().format('LT')

    let [comprovante, erro, status] = delayManager.validateEntry(id_atraso, responsavel, professor, horario, data, motivo)
    return res.status(status || 500).json({ comprovante, erro, status })
})



export default router;