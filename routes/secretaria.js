import express from 'express'

// Modulos Node
import moment from 'moment';
import { console } from 'inspector';

// Modulos

import { delayManager } from '../modules/student_delay_manager.js'
import { userManager } from '../modules/user_manager.js';
import { protegerSenhaUsuario } from '../modules/criptografar.js';

// Middleware
import validarToken from '../middlewares/auth_jwt.js'; // Middleware para verificar as permições com JWT
import { upload } from "../middlewares/multer.js";
import { validarAluno } from '../middlewares/validar_user_body.js';
import { validarFuncionario } from '../middlewares/validar_user_body.js';

// Modelos MongoDB
import User from '../models/user_model.js';

const router = express.Router()

// Função para criar ID de usuario

const criarUID = () => {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    return id;
}


/* ---------------------------------------------------------


    ROTAS


------------------------------------------------------------*/



// Busca as informações do usuário que está loggado na conta com base no token que é enviado.
router.get('/user/me', validarToken(true), async (req, res) => {
    const decodedInfo = req.decoded;

    if (!decodedInfo) {
        return res.status(404).json({ msg: "Usuario não encontrado." })
    } else {
        const id = decodedInfo.id
        const user = await userManager.findUserByKey({ id: id })


        if (user) {
            return res.status(200).json({ user })
        } else {
            return res.status(404).json({ msg: "Usuário não encontrado." })
        }
    }
})

// Registra novos alunos
router.post(
    '/registrar/aluno',
    validarToken(true), // Primeiro valida o token
    upload.single('foto_perfil'), // Fazendo o upload da foto de perfil
    validarAluno, // Agora iremos validar usando o JOI

    async (req, res) => {
        const uid = criarUID()
        const usuario = protegerSenhaUsuario(req.body)

        usuario.id = uid
        usuario.senha_foi_alterada = false // O usuário acavou de ser criado, portanto está com a senha padrão
        usuario.email = ``
        usuario.cargo = "aluno"
        try {
            const novoAluno = await User.create(usuario)
            return res.status(201).json({ msg: `Aluno ${novoAluno.nome} criado com sucesso!`, UID_aluno: novoAluno.id })
        } catch (error) {
            // return res.status(500).json(error.code)
            if (error.code === 11000) {
                // Há uma tentativa de ou criar uma conta com o mesmo Rg, Id, email, ou matricula que outra já existente.

                return res.status(500).json({ msg: `Já há um usuário com esses dados`, error })
            }
        }
    }
);

// Registrando novos funcionários
router.post(
    '/registrar/funcionario',
    validarToken(true), // Primeiro valida o token
    upload.single('foto_perfil'), // Fazendo o upload da foto de perfil
    validarFuncionario, // Agora iremos validar usando o JOI

    async (req, res) => {
        const uid = criarUID()

        const usuario = protegerSenhaUsuario(req.body)
        usuario.id = uid
        usuario.cargo = "funcionario"
        usuario.senha_padrao = ""

        try {
            const novoFuncionario = await User.create(usuario)
            return res.status(201).json({ msg: `Funcionario ${novoAluno.nome} criado com sucesso!`, UID_funcionadio: novoFuncionario.id })
        } catch (error) {
            if (error.code === 11000) {
                // Há uma tentativa de ou criar uma conta com o mesmo Rg, Id, email, ou matricula que outra já existente.

                return res.status(500).json({ msg: `Já há um usuário com esses dados`, error })
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

router.post('/iniciar', async (req, res) => {
    try {
        const secretaria = await User.create({

            "id": 0,
            "nome": "Secretaria Senai Nami Jafet",
            "cargo": "secretaria",
            "login": "secretaria117",
            "senha": "5yUuYL+x1QWa2CNZ9bE+WjRs7DL1NIf/xGsE2rRkFyk=",
            "salt": "hwridqul519"
        })

        if (secretaria) {
            return res.status(201).json({ msg: "Secretaria criada com sucesso." })
        }

    } catch (error) {
        return res.status(500).json({ msg: "Erro ao criar secretaria.", error })
    }

})

export default router;