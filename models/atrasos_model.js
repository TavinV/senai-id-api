import { number, required } from "joi";
import mongoose from "mongoose";

const atrasoSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: [true, "Id é obrigatório."],
            unique: true
        },
        user_id: {
            type: String,
            required: [true, "User id é obrigatório."],
        },
        horario_entrada: {
            type: Number,
            required: [true, "Horário entrada é obrigatório."],
        },
        atraso: {
            tpye: Number,
            required: [true, "Ataso é obrigatório."],
        },
        status: {
            type: String,
            default: "pendente",
            required: [true, "Status é obrigatório."],
        },
        informacoesRedirecionamento: {
            type: Object,
            default: {},
            required: [true, "Informações redirecionamento são obrigatórias."],
        }
    },
    {
        timestamps: true,
        collection: "atrasos"
    }
);

const Atraso = mongoose.model('Atraso', atrasoSchema);

export default Atraso;