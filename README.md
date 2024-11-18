# API REST - Gerenciamento de Alunos SENAI

Este projeto implementa uma API REST para gerenciar alunos do SENAI, oferecendo funcionalidades como registro, autenticação, geração de carteirinhas digitais e permissões baseadas em cargos.

---

## Instalação

1. **Instale as dependências:**
   ```bash
   npm install
Crie um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente:

env
Copiar código
PORT=3000
SECRET=<sua-chave-secreta-jwt>
Inicie o servidor:

bash
Copiar código
npm start
Estrutura do Projeto
bash
Copiar código
.
├── routes/
│   ├── admSenaiID.js        # Rotas para administração de alunos SENAI
│   ├── carteirinha.js       # Rotas para geração de carteirinhas digitais
│   ├── login.js             # Rota de autenticação de usuários
│   ├── rerouter.js          # Rota para verificação de permissões
├── modules/
│   ├── database_manager.js  # Gerenciamento de banco de dados
├── middleware/
│   ├── auth_jwt.js          # Middleware para validação de JWT
├── db/
│   ├── fotos_perfil/        # Diretório de armazenamento de fotos de perfil
├── .env                     # Configurações de ambiente
├── server.js                # Arquivo principal
Rotas
/login
POST /login
Autentica um usuário e retorna um token JWT e seu cargo.

Parâmetros do Corpo (JSON):

login (string): Nome de usuário.
senha (string): Senha do usuário.
Resposta:

200 OK: { "cargo": "aluno", "token": "<jwt-token>" }
401 Unauthorized: { "msg": "Login ou senha incorretos." }
500 Internal Server Error
/admsenaiid
POST /admsenaiid/registrar
Registra um novo aluno, validando o token e armazenando sua foto de perfil.

Parâmetros do Corpo (JSON + Multipart):

Campos obrigatórios: nome, rg, login, senha, cargo, curso, data_nascimento, matricula, foto_perfil.
Resposta:

201 Created: { "msg": "Usuário registrado com sucesso." }
400 Bad Request: { "error": "Campos obrigatórios ausentes: ..." }
500 Internal Server Error
GET /admsenaiid/
Retorna informações do usuário autenticado.

Resposta:

200 OK: { "user": { ... } }
404 Not Found: { "msg": "Usuário não encontrado." }
/carteirinha
GET /carteirinha/users
Retorna informações do usuário autenticado.

GET /carteirinha/users/fotoperfil
Retorna a imagem de perfil do usuário.

GET /carteirinha/users/access
Gera uma URL para um QR Code com base no cargo do usuário.

Resposta:

200 OK: { "url": "https://api.qrserver.com/v1/create-qr-code/?data=..." }
404 Not Found: { "msg": "Imagem de perfil não encontrada." }
/rerouter
GET /rerouter/
Verifica permissões do usuário com base no token.

Resposta:

200 OK: { "cargo": "aluno" }
403 Forbidden: { "msg": "Token inválido." }
400 Bad Request: { "msg": "Token não fornecido." }
Middleware
O middleware principal da aplicação é auth_jwt.js, responsável por:

Validar tokens JWT enviados pelo cliente.
Proteger rotas sensíveis, permitindo acesso apenas a usuários autenticados.
Determinar permissões com base nos dados do token (por exemplo, cargos).
