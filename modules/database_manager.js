import path from 'path'
import fs from 'fs'

import { fileURLToPath } from 'url';
import { console } from 'inspector';
import * as criptografar from '../modules/criptografar.js' // Módulo que cuida da criptografia
import { log } from 'console';


// Para utilizar o __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db_file_path = path.join(__dirname, '../db/users.json');

// Função interna, serve para ler o arquivo JSON
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
        console.log("esse erro veio do módulo")
        throw err; // Lança o erro para que a rota possa lidar com ele
    }

    return users;
}

export function procurarContaLoginESenha(login, senha) {
    const users = ler_dbJSON()
    let user = null
    // Verificando se o login inputado pertence a alguma conta
    const usuarioEncontrado = users.filter(u => u.login == login)

    console.log(usuarioEncontrado)
    if (usuarioEncontrado.length > 0) {
        // Criptografando a senha inputada e comparando as duas senhas.
        const salt = usuarioEncontrado[0].salt
        const senhaCriptografada = criptografar.criarHash(senha, salt)

        if (senhaCriptografada == usuarioEncontrado[0].senha) {
            return usuarioEncontrado[0]
        }
    } else {
        return undefined
    }
}

export function registrarAluno(nome, rg, login, senha, cargo, curso, matricula, data_nascimento, foto) {
    let users = ler_dbJSON()

    if (procurarUsuarioKey({ login: login })) {
        throw new Error('Já existe um aluno com esse login')
    } else {

        const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const salt = criptografar.criarSalt()
        const senhaSegura = criptografar.criarHash(senha, salt)

        const newUser = {
            id,
            nome,
            rg,
            foto_perfil: foto,
            login,
            senha: senhaSegura,
            salt,
            cargo,
            curso,
            matricula,
            data_nascimento,
            default_pass: true
        };

        // Adiciona o usuário ao JSON e responde com sucesso
        users.push(newUser);
        fs.writeFileSync(db_file_path, JSON.stringify(users, null, 2));
    }
}

export function registrarProfessor(nome, cpf, login, senha, cargo, descricao, nif, pis, foto) {
    let users = ler_dbJSON()

    if (procurarUsuarioKey({ login: login })) {
        throw new Error('Já existe um aluno com esse login')
    } else {

        const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const salt = criptografar.criarSalt()
        const senhaSegura = criptografar.criarHash(senha, salt)

        const newUser = {
            id,
            nome,
            cpf,
            foto_perfil: foto,
            login,
            senha: senhaSegura,
            salt,
            cargo: "funcionario",
            descricao,
            nif,
            pis,
            default_pass: true
        };

        // Adiciona o usuário ao JSON e responde com sucesso
        users.push(newUser);
        fs.writeFileSync(db_file_path, JSON.stringify(users, null, 2));
    }
}

export function procurarUsuarioKey(criterio) {
    const users = ler_dbJSON(); // Função para ler os dados do banco de usuários

    // Extrai a chave e o valor do objeto critério
    const [key, value] = Object.entries(criterio)[0];

    // Procura o primeiro usuário que corresponda à chave e valor
    const usuario = users.find(u => u[key] === value);

    return usuario || null; // Retorna o usuário ou null se não encontrar
}