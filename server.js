import express from 'express'
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';

import admSenaiID from './routes/admSenaiID.js'
import login from './routes/login.js'
import carteirinha from './routes/carteirinha.js'
import rerouter from './routes/rerouter.js'

import * as dbFetch from './modules/database_manager.js'

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
app.use('/rerouter', rerouter)
app.use('/admsenaiid', admSenaiID)
app.use('/login', login)
app.use('/carteirinha', carteirinha)

app.listen(port, () => console.log(`Servidor ativo na porta ${port}`))