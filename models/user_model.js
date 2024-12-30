import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: [true, "Id é obrigatório"],
            unique: true
        },
        nome: {
            type: String,
            required: [true, "Nome é obrigatório"]
        },
        login: {
            type: String,
            required: [true, "Login é obrigatório"],
            unique: true
        },
        senha: {
            type: String,
            required: [true, "Senha é obrigatório"]
        },
        cargo: {
            type: String,
            required: [true, "Cargo é obrigatório"],
            enum: ["aluno", "funcionario", "secretaria"]
        },
        rg: {
            type: String
        },
        salt: {
            type: String,
            required: [true, "Salt é obrigatório"]
        },
        email: {
            type: String,
            unique: true,
            sparse: true // Permite emails únicos ou campos vazios
        },
        data_nascimento: {
            type: String // Comum a todos
        },
        foto_perfil: {
            type: String // Usado para "secretaria" e opcional para outros
        },
        // Campos específicos para Aluno
        curso: {
            type: String // Apenas para alunos
        },
        turma: {
            type: String // Apenas para alunos
        },
        horario_entrada: {
            type: String // Apenas para alunos
        },
        matricula: {
            type: String,
            unique: true // Apenas para alunos
        },
        senha_padrao: {
            type: String // Apenas para alunos
        },
        senha_foi_alterada: {
            type: Boolean,
            default: false // Apenas para alunos
        },
        // Campos específicos para Funcionário
        cpf: {
            type: String,
            unique: true // Apenas para funcionários
        },
        pis: {
            type: String // Apenas para funcionários
        },
        nif: {
            type: String // Apenas para funcionários
        },
    },
    {
        timestamps: true, // Inclui createdAt e updatedAt
        collection: "users"
    }
);

const User = mongoose.model("User", userSchema);

export default User;
