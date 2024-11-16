import path from 'path'
import fs from 'fs'

import { fileURLToPath } from 'url';
import { console } from 'inspector';

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

    const conta = users.filter(u => u.login == login && u.senha == senha)
    if (conta.length > 0) {
        return conta[0]
    } else {
        return null
    }
}

export function registrarAluno(nome, rg, login, senha, cargo, curso, matricula, data_nascimento, foto) {
    let users = ler_dbJSON()
    const newUser = {
        id: users.length + 1,
        nome,
        rg,
        foto_perfil: foto,
        login,
        senha,
        cargo,
        curso,
        matricula,
        data_nascimento
    };

    // Adiciona o usuário ao JSON e responde com sucesso
    users.push(newUser);
    fs.writeFileSync(db_file_path, JSON.stringify(users, null, 2));
}

export function procurarUsuarioKey(criterio) {
    const users = ler_dbJSON(); // Função para ler os dados do banco de usuários

    // Extrai a chave e o valor do objeto critério
    const [key, value] = Object.entries(criterio)[0];

    // Procura o primeiro usuário que corresponda à chave e valor
    const usuario = users.find(u => u[key] === value);

    return usuario || null; // Retorna o usuário ou null se não encontrar
}