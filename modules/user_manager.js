import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as criptografar from './criptografar.js';
import Aluno from '../models/aluno_model.js';

class UserManager {

  // Método para encontrar um usuário pelo login e senha
  async findUserByLoginAndPassword(loginFornecido, senha) {

    try {
      const alunoComLogin = await Aluno.findOne({ login: loginFornecido });
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
    return Aluno.findOne(criteria)
  }

}

// Exporta a instância do UserManager
export const userManager = new UserManager();
