import Joi from 'joi';
import { alunoSchema } from '../schemas/schemas.js'; // Supondo que o schema aluno esteja exportado aqui

// Middleware para validar o corpo da requisição
export const validarAluno = async (req, res, next) => {
    // Primeiro, valida se a imagem foi enviada
    if (!req.file) {
        return res.status(400).json({ error: 'Foto de perfil é obrigatória.' });
    }

    // Validando os outros dados do corpo com o alunoSchema
    const { error } = alunoSchema.validate(req.body, { abortEarly: false });

    if (error) {
        // Retorna os erros de validação em formato mais amigável
        const errorMessages = error.details.map(err => err.message);
        return res.status(400).json({ error: errorMessages });
    }

    // Se tudo estiver correto, passa para o próximo middleware
    next();

};