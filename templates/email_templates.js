export const OTP_verification_email_template = (OTP, nome) => {
    const content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: #e30613;
            color: #ffffff;
            text-align: center;
            padding: 20px 10px;
        }
        .email-header h1 {
            font-size: 24px;
            font-weight: 600;
        }
        .email-body {
            padding: 20px;
            text-align: center;
            color: #333333;
        }
        .email-body p {
            font-size: 16px;
            margin-bottom: 20px;
        }
        .verification-code {
            display: inline-block;
            background-color: #f4f4f4;
            color: #e30613;
            font-size: 24px;
            font-weight: 600;
            padding: 10px 20px;
            border: 2px dashed #e30613;
            border-radius: 8px;
            margin: 20px 0;
        }
        .email-footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777777;
            background-color: #f9f9f9;
        }
        .email-footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Senai ID</h1>
        </div>
        <div class="email-body">
            <p>Olá, ${nome},</p>
            <p>Use o código abaixo para verificar sua conta:</p>
            <div class="verification-code">${OTP}</div>
            <p>Este código expira em 10 minutos. Não compartilhe este código com ninguém.</p>
        </div>
        <div class="email-footer">
            <p>© 2025 Senai ID. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>`;

    return content;

} 