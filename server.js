import express from 'express'
import path from 'path'
import register from './routes/register.js'
import cors from 'cors'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// import carteirinha from './routes/carteirinha.js'
const port = 3000

const app = express()

// Static
app.use(express.static(path.join(__dirname, 'static')))

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rotas
app.use('/register', register)
// app.use('/api/senaiid', carteirinha)

app.listen(port, () => console.log(`Servidor ativo na porta ${port}`))