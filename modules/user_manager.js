import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as criptografar from './criptografar.js';
import User from '../models/user_model.js';

class UserManager {

  // Método para encontrar um usuário pelo login e senha
  async findUserByLoginAndPassword(loginFornecido, senha) {

    try {
      const alunoComLogin = await User.findOne({ login: loginFornecido });
      if (alunoComLogin) {
        const senhaCriptografada = criptografar.criarHash(senha, alunoComLogin.salt);

        if (senhaCriptografada === alunoComLogin.senha) {
          return alunoComLogin
        }
        return null
      }
      return null

    } catch (error) {
      return null
    }
  }

  findUserByKey(criteria) {
    return User.findOne(criteria)
  }

}

// Exporta a instância do UserManager
export const userManager = new UserManager();
