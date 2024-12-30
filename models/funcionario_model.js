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
        cpf: {
            type: String,
            required: [true, "Cpf é obrigatório"],
            unique: true
        },
        login: {
            type: String,
            required: [true, "Login é obrigatório"],
            unique: true
        },
        senha: {
            type: String,
            required: [true, "Senha é obrigatório."]
        },
        cargo: {
            type: String,
            required: [true, "Cargo é obrigatório."]
        },
        pis: {
            type: String,
            required: [true, "Pis é obrigatório."]
        },
        nif: {
            type: String,
            required: [true, "Nif é obrigatório."]
        },
        data_nascimento: {
            type: String,
            required: [true, "Data nascimento é obrigatório."]
        },
        salt: {
            type: String,
            required: [true, "Salt é obrigatório."]
        },
        default_pass: {
            type: Boolean,
            required: [true, "Default pass é obrigatório."]
        },
        email: {
            type: String,
            required: [true, "Email é obrigatório."],
            unique: true,
        }
    },
    {
        timestamps: true,
        collection: "users"
    }
);

const funcionario = mongoose.model('Funcionario', userSchema);

module.exports = User;
