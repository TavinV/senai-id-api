import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as criptografar from './criptografar.js';

// Para utilizar o __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UserManager {
  constructor(dbFilePath) {
    this.dbFilePath = dbFilePath;
  }

  // Método privado para ler o banco de dados JSON
  #readDatabase() {
    try {
      if (fs.existsSync(this.dbFilePath)) {
        const fileData = fs.readFileSync(this.dbFilePath, 'utf-8');
        return JSON.parse(fileData);
      } else {
        throw new Error('Arquivo JSON não encontrado');
      }
    } catch (err) {
      console.error('Erro ao ler o banco de dados:', err.message);
      throw err;
    }
  }

  // Método privado para salvar no banco de dados JSON
  #saveDatabase(data) {
    try {
      fs.writeFileSync(this.dbFilePath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Erro ao salvar no banco de dados:', err.message);
      throw err;
    }
  }

  // Método para encontrar um usuário pelo login e senha
  findUserByLoginAndPassword(login, senha) {
    const users = this.#readDatabase();
    const usuarioEncontrado = users.find(u => u.login === login);

    if (usuarioEncontrado) {
      const { salt, senha: senhaArmazenada } = usuarioEncontrado;
      const senhaCriptografada = criptografar.criarHash(senha, salt);

      if (senhaCriptografada === senhaArmazenada) {
        return usuarioEncontrado;
      }
    }
    return null;
  }

  // Método genérico para registrar um usuário
  registerUser(userData) {
    const users = this.#readDatabase();

    if (this.findUserByKey({ login: userData.login })) {
      throw new Error('Já existe um usuário com esse login');
    }

    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const salt = criptografar.criarSalt();
    const senhaSegura = criptografar.criarHash(userData.senha, salt);

    const newUser = {
      id,
      ...userData,
      senha: senhaSegura,
      salt,
      default_pass: true,
    };

    users.push(newUser);
    this.#saveDatabase(users);
  }

  // Método para encontrar um usuário por critério
  findUserByKey(criteria) {
    const users = this.#readDatabase();
    const [key, value] = Object.entries(criteria)[0];
    return users.find(u => u[key] === value) || null;
  }
}

// Caminho do arquivo JSON
const dbFilePath = path.join(__dirname, '../db/users.json');

// Exporta a instância do UserManager
export const userManager = new UserManager(dbFilePath);
