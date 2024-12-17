import Joi from "joi";

const alunoSchema = Joi.object({
    nome: Joi.string().required(),
    rg: Joi.string().required(),
    login: Joi.string().required(),
    senha: Joi.string().required(),
    cargo: Joi.string().required().valid('aluno', 'funcionario'),
    turma: Joi.string().required(),
    horario_entrada: Joi.string().required(),
    matricula: Joi.string().required(),
    data_nascimento: Joi.string().required(),
    curso: Joi.string().required()
})

const funcionarioSchema = Joi.object({
    nome: Joi.string().required(),
    cpf: Joi.string().length(11).required(), // CPF com 11 dígitos
    login: Joi.string().required(),
    senha: Joi.string().required(),
    pis: Joi.string().length(11).required(), // PIS com 11 dígitos
    descricao: Joi.string().optional(), // Descrição do funcionário
    nif: Joi.string().optional(), // Número de identificação fiscal (se aplicável)
    data_nascimento: Joi.string().required(), // Data 
});


export function verificarAluno(aluno) {
    const { error } = alunoSchema.validate(aluno)
    if (error) {
        return [400, error.details[0].message]
    } else {
        return [200, "Aluno válido"]
    }
}

export function verificarFuncionario(funcionario) {
    const { error } = funcionarioSchema.validate(funcionario)
    if (error) {
        return [400, error.details[0].message]
    } else {
        return [200, "Funcionário válido"]
    }
}