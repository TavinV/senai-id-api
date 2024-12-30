import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: [true, "Id é obrigatório."],
            unique: true
        },
        nome: {
            type: String,
            required: [true, "Nome é obrigatório."]
        },
        rg: {
            type: String,
            required: [true, "Rg é obrigatório."],
            unique: true
        },
        login: {
            type: String,
            required: [true, "Login é obrigatório."],
            unique: true
        },
        senha: {
            type: String,
            required: [true, "Senha é obrigatório."]
        },
        cargo: {
            type: String,
            default: "aluno"
        },
        curso: {
            type: String,
            required: [true, "Curso é obrigatório"],
        },
        turma: {
            type: String,
            required: [true, "Turma é obrigatório."]
        },
        horario_entrada: {
            type: String,
            required: [true, "Horario entrada é obrigatório."]
        },
        matricula: {
            type: String,
            required: [true, "Matricula é obrigatório."],
            unique: true
        },
        data_nascimento: {
            type: String,
            required: [true, "Data nascimento é obrigatório."]
        },
        salt: {
            type: String,
            required: [true, "Salt é obrigatório."]
        },
        senha_padrao: {
            type: String,
            required: [true, "Senha padrão é obrigatório."]
        },
        senha_foi_alterada: {
            type: Boolean,
            default: false,
            required: [true, "Senha foi alterada é obrigatório."]
        },
        email: {
            type: String,
            default: "",
            required: [true, "Email é obrigatório."],
            unique: true,
        },
        foto_perfil: {
            type: String,
            required: [true, "Foto perfil é obrigatório."],
        }
    },
    {
        timestamps: true,
        collection: "users"
    }
);

const Aluno = mongoose.model('Aluno', userSchema);

export default Aluno;
