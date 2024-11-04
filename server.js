import express from 'express'
import path from 'path'

import admSenaiID from './routes/admSenaiID.js'
import login from './routes/login.js'
import carteirinha from './routes/carteirinha.js'
import auth_jwt from './middleware/auth_jwt.js'

import cors from 'cors'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
const port = 3000

const app = express()
// Static
app.use('/static', express.static(path.join(__dirname, './static')));
app.use(cookieParser());

const allowedOrigins = ['http://127.0.0.1:5501', 'http://127.0.0.1:5500', 'https://tavinv.github.io/senai-id/']; // Origens permitidas

app.use(cors({
    origin: allowedOrigins,
    credentials: true // Permite envio de cookies e outras credenciais
}));

dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rotas
app.use('/admsenaiid', admSenaiID)
app.use('/login', login)
app.use('/carteirinha', carteirinha)

app.listen(port, () => console.log(`Servidor ativo na porta ${port}`))