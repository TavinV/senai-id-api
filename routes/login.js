import express from 'express'
import jwt from 'jsonwebtoken';
import * as dbMng from '../modules/database_manager.js'

const router = express.Router()

const paginasDosCargos = {
    aluno: 'pages/access/carteirinha.html',
    funcionario: 'pages/employees-access/carteirinha.html',
    secretaria: 'pages/register/register.html'
}

router.post('/', (req, res) => {
    const { login, senha } = req.body;
    try {
        const conta = dbMng.procurarContaLoginESenha(login, senha)
        if (conta) {
            const secret = process.env.SECRET;

            // Assinando um token JWT com o cargo e ID do usuário.
            const token = jwt.sign({ id: conta.id, cargo: conta.cargo }, secret, { expiresIn: "7d" });

            // Enviando o usuário para a página referente ao seu cargo
            const cargo = conta.cargo
            const responseUrl = paginasDosCargos[cargo];

            return res.status(200).json({ url: responseUrl, token: token });

        } else {
            return res.status(401).json({ msg: "Login ou senha incorretos." });
        }
    } catch (err) {
        return res.status(500).json({ msg: "Ocorreu um erro ao carregar o banco de dados", erro: err.message });
    }
});

export default router;