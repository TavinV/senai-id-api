import express from 'express'
import { userManager } from '../modules/user_manager.js';
import Otp from '../models/email_verification_OTP_model.js'
import User from '../models/user_model.js';
import { sendOTPVerification } from '../controllers/nodemailer.js'
import moment from 'moment';

function verificarDiferencaMenorQue10(data1, data2) {
    // Converta as datas para objetos Moment
    const momento1 = moment(data1);
    const momento2 = moment(data2);

    // Calcule a diferença em minutos
    const diffMinutes = Math.abs(momento1.diff(momento2, 'minutes'));

    // Verifique se a diferença é menor que 10
    return diffMinutes;
}

/* -------------------------------------- 

ROTAS

-----------------------------------------*/
const router = express.Router()

router.post('/request/otp/', async (req, res) => {
    const { email, id } = req.body

    const otp_gerado = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    try {
        Otp.create({ userId: id, expires, otp: otp_gerado, userEmail: email })

        const [info, erro] = await sendOTPVerification(id, otp_gerado, email)

        if (erro) {
            return res.status(500).json({ msg: "Não foi possível enviar o email." })
        }

        return res.status(200).json({ msg: `Enviamos o código de 6 dígitos para o email: ${email}` })

    } catch (error) {
        return res.status(500).json({ msg: "Não foi possível gerar seu código de verificação." })
    }

})

router.post('/validate/otp', async (req, res) => {
    const { otp } = req.body
    const found_OTP = await Otp.findOne({ otp: otp })

    if (found_OTP) {
        const expirado = verificarDiferencaMenorQue10(new Date(), found_OTP.expires)
        if (expirado < 10) {
            const userID = found_OTP.userId

            const resultado = await User.updateOne(
                { id: userID },
                { $set: { email: found_OTP.userEmail } }
            )

            if (resultado.matchedCount === 0) {
                return res.status(404).json({ msg: "Não encontramos esse usuário." })
            } else if (resultado.modifiedCount > 0) {
                return res.status(200).json({ msg: "Seu email foi verificado." })
            } else {
                console.log('O email já estava atualizado.');
            }

        } else {
            return res.status(400).json({ msg: "Código de verificação expirado." })
        }
    } else {
        return res.status(400).json({ msg: "Código inválido" })
    }
})

export default router;