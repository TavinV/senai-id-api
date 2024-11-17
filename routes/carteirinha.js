import express, { response } from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import validarToken from '../middleware/auth_jwt.js'
import * as DbMng from '../modules/database_manager.js'

// Para utilizar o __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router()

// Rota que é executada ao entrar na página de carteirinha, verifica a validade do Token e expulsa o usuário caso não seja um token válido.
router.get('/users/', validarToken(false), (req, res) => {
    const id = req.decoded.id
    const user = DbMng.procurarUsuarioKey({ id: id })

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

router.get('/userfotoperfil/', validarToken(false), (req, res) => {
    let id = req.decoded.id
    const user = DbMng.procurarUsuarioKey({ id: id })

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado." })
    }

    let profileImagePath = buscarFoto(user.foto_perfil)

    if (!profileImagePath) {
        return res.status(404).json({ msg: "Imagem de perfil não encontrada." });
    }
    return res.sendFile(profileImagePath);
})

export default router;