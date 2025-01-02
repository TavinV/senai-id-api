import nodemailer from 'nodemailer'
import { userManager } from '../modules/user_manager.js';
import User from '../models/user_model.js';

const NOREPLY_EMAIL = process.env.NOREPLY_EMAIL
const NOREPLY_EMAIL_PASS = process.env.NOREPLY_EMAIL_PASS

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: NOREPLY_EMAIL,
        pass: NOREPLY_EMAIL_PASS,
    },
});

async function sendMail(to, subject, html) {
    const mailInfo = {
        from: NOREPLY_EMAIL,
        to,
        subject,
        html
    }

    const emailDetails = await transporter.sendMail(mailInfo)
    if (emailDetails.accepted.length > 0) {
        return [emailDetails, null]
    } else {

        return [null, "Não foi possível enviar o email."];
    }
}

// Templates

import { OTP_verification_email_template } from '../templates/email_templates.js';

export const sendOTPVerification = async (UID, OTP, email) => {
    const userAchado = await User.findOne({ id: UID })
    const html = OTP_verification_email_template(OTP, userAchado.nome)
    return sendMail(email, "🔐 Verificação email", html)
}

