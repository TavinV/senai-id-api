import Joi from 'joi';
import { alunoSchema } from '../schemas/schemas.js'; // Supondo que o schema aluno esteja exportado aqui
import { funcionarioSchema } from '../schemas/schemas.js';

// Middleware para validar o corpo da requisição
export const validarAluno = async (req, res, next) => {
    // Primeiro, valida se a imagem foi enviada
    if (!req.file) {
        return res.status(400).json({ msg: 'Foto de perfil é obrigatória.' });
    }

    // Validando os outros dados do corpo com o alunoSchema
    const { error } = alunoSchema.validate(req.body, { abortEarly: false });

    if (error) {
        // Retorna os erros de validação em formato mais amigável
        const errorMessages = error.details.map(err => err.message);
        return res.status(400).json({ msg: errorMessages });
    }

    // Se tudo estiver correto, passa para o próximo middleware
    next();

};

export const validarFuncionario = async (req, res, next) => {
    // Primeiro, valida se a imagem foi enviada
    if (!req.file) {
        return res.status(400).json({ msg: 'Foto de perfil é obrigatória.' });
    }

    // Validando o corpo utilziando o JOI e a schema de funcionario
    const { error } = funcionarioSchema.validate(req.body, { abortEarly: false });

    if (error) {
        // Retorna os erros de validação em formato mais amigável
        const errorMessages = error.details.map(err => err.message);
        return res.status(400).json({ msg: errorMessages })
    }

    // Se tudo estiver correto, passa para o próximo middleware
    next()
}