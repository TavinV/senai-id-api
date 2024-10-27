import express from 'express'
import path from 'path'

import admSenaiID from './routes/admSenaiID.js'
import login from './routes/login.js'
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
dotenv.config()
app.use(express.static(path.join(__dirname, 'static')))
app.use(cookieParser())
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rotas
app.use('/admsenaiid', admSenaiID)
app.use('/login', login)

app.get('/paineladm/:id', (req, res) => {
    console.log('adm')
})
app.get('/carteirinha/:id', (req, res) => {
    console.log('aluno')
})


app.listen(port, () => console.log(`Servidor ativo na porta ${port}`))