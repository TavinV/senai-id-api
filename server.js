import express from 'express'
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import connectDB from './db/mongoDbConection.js';

import secretaria from './routes/secretaria.js'
import login from './routes/login.js'
import carteirinha from './routes/carteirinha.js'
import rerouter from './routes/rerouter.js'
import verification from './routes/verification.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3000
const app = express()

const allowedOrigins = ['http://127.0.0.1:5501', 'http://127.0.0.1:5500']; // Origens permitidas

app.use(cors({
    origin: allowedOrigins,
    credentials: true // Permite envio de cookies e outras credenciais
}));

dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rotas
app.use('/api/rerouter', rerouter)
app.use('/api/secretaria', secretaria)
app.use('/api/login', login)
app.use('/api/carteirinha', carteirinha)
app.use('/api/verification', verification)



connectDB().then(async () => {
    app.listen(port, () => console.log(`Servidor ativo na porta ${port}`))

}).catch((erro_conexao) => {
    console.log("Conexão com o banco de dados falhou.")
    console.log(erro_conexao)
})
