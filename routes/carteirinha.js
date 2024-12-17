import express, { response } from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import validarToken from '../middleware/auth_jwt.js'
import { userManager } from '../modules/user_manager.js'
import { delayManager } from '../modules/student_delay_manager.js'
import moment from 'moment';

// Para utilizar o __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router()

// Rota que é executada ao entrar na página de carteirinha, verifica a validade do Token e expulsa o usuário caso não seja um token válido.
router.get('/me', validarToken(false), (req, res) => {
    const id = req.decoded.id
    const user = userManager.findUserByKey({ id: id })

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
    } else {
        return res.status(200).json({ user });
    }
})

function buscarFoto(nomeArquivo) {
    // Diretório aonde estão as fotos de perfil
    const basePath = path.join(__dirname, '../db/fotos_perfil');
    const filePath = path.join(basePath, `${nomeArquivo}`);

    // Verificando se o arquivo nomeArquivo existe
    if (fs.existsSync(filePath)) {
        return filePath;
    }
}

function calcularMinutosDeAtraso(aluno) {
    const now = moment();
    const horarioEntrada = moment(aluno.horario_entrada, 'HH:mm');

    if (now.isAfter(horarioEntrada)) {
        return now.diff(horarioEntrada, 'minutes');
    }
    return 0; // Sem atraso
}

function gerarQRCODE(user) {
    let accessKey = ""

    switch (user.cargo) {
        case "aluno":
            accessKey = user.matricula.toString().padStart(20, '0');
            break;
        case "funcionario":
            accessKey = user.nif.toString().padStart(20, '0');
            break;

        default:
            return res.status(400).json({ msg: "Usuário com cargo não identificado" })
            break;
    }

    return `https://api.qrserver.com/v1/create-qr-code/?data=${accessKey}&amp;size=100x100`
}

router.get('/me/fotoperfil', validarToken(false), (req, res) => {
    let id = req.decoded.id
    const user = userManager.findUserByKey({ id: id })


    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado." })
    }

    let profileImagePath = buscarFoto(user.foto_perfil)
    console.log(user.foto_perfil)

    if (!profileImagePath) {
        return res.status(404).json({ msg: "Imagem de perfil não encontrada." });
    }
    return res.sendFile(profileImagePath);
})

router.get('/me/access', validarToken(false), (req, res) => {
    const userId = req.decoded.id;
    const user = userManager.findUserByKey({ id: userId });

    // Obtém o horário de entrada do usuário

    const minutosDeAtraso = calcularMinutosDeAtraso(user)

    const TOLERANCIA_MIN = 15; // minutos
    const TOLERANCIA_MAX = 60; // minutos

    console.log(minutosDeAtraso)
    if (minutosDeAtraso >= TOLERANCIA_MIN) {
        // Aluno atrasado.
        const atrasoId = delayManager.registerLateEntry(userId, minutosDeAtraso);

        if (atrasoId) {
            return res.status(200).json({ url: gerarQRCODE(user), atraso_id: atrasoId })
        }
    } else {
        // Aluno não atrasado.
        return res.status(200).json({ url: gerarQRCODE(user) })

    }
})

export default router;