import express from 'express'

// Modulos Node
import moment from 'moment';
import { console } from 'inspector';

// Modulos

import { delayManager } from '../modules/student_delay_manager.js'
import { userManager } from '../modules/user_manager.js';
import { protegerSenhaUsuario } from '../modules/criptografar.js';

// Middleware
import validarToken from '../middleware/auth_jwt.js'; // Middleware para verificar as permições com JWT
import { upload } from "../middleware/multer.js";
import { validarAluno } from '../middleware/validar_user_body.js';

// Modelos MongoDB

import Aluno from '../models/aluno_model.js';
import mongoose from 'mongoose';

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

// Registra novos alunos, validando as permissões com JWT e enviando a sua foto na pasta através do multer.
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
        usuario.email = `${uid}@naotememail.com`
        try {
            const novoAluno = await Aluno.create(usuario)
            return res.status(201).json({ msg: `Aluno ${novoAluno.nome} criado com sucesso!`, UID_aluno: novoAluno.id })
        } catch (error) {
            let mensagemErro
            if (error.name === 'MongoError' && error.code === 11000) {
                // Há uma tentativa de ou criar uma conta com o mesmo Rg, Id, email, ou matricula que outra já existente.

                return res.status(500).json({ msg: `Já há um usuário com esses dados:s`, error })
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