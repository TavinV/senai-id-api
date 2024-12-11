# Senai ID

API REST Para o projeto de TCC do curso de Desenvolvimento de sistemas da turma I1P - Senai Nami Jafet


## Login

```http
  POST /api/login
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `login`      | `string`  | **Obrigatório**. Login do usuário |
| `senha`      | `string`  | **Obrigatório**. Senha do usuário |

### Respostas

#### 200 OK
```
{
  cargo: "aluno"
  token: <token>
}

```

* O token contem o cargo da conta e o seu ID.

#### 401 Unahuthorized
```
{msg: "Login ou senha incorretos"}
```

#### 500 Internal server error

```
{ msg: "Ocorreu um erro ao carregar o banco de dados", erro: error }
```

## Carteirinha
```http
  GET /api/carteirinha/me
```

Essa rota pode retornar ou uma conta de um funcionário ou de um aluno.

### Cabeçalho (obrigatório em todas as rotas):

```
{
  "Authorization": "Bearer <token>"
}
```

### Respostas

#### 200 OK
Exemplo de dados de uma conta de aluno

```
{
  {
    "id": "<string>",
    "nome": "Fulano da Silva",
    "rg": "123456789",
    "foto_perfil": "<matricula>_pfp.png",
    "login": "24918236",
    "senha": "senhaComHsh",
    "salt": "saltDaSenha",
    "cargo": "aluno",
    "curso": "Técnico em Desenvolvimento de sistemas",
    "matricula": "12345678",
    "data_nascimento": "2001-01-01",
    "default_pass": true 
  },
}
```
* default_pass: se o usuário ja trocou a senha padrão ou não. 

Exemplo de dados de uma conta de funcionário

```
  {
    {
      "id": "2dxjpmqoywqm3s24k4r",
      "nome": "Fulano da Silva",
      "cpf": "12345676890",
      "foto_perfil": "<nif>_pfp.png",
      "login": "24918236",
      "senha": "senhaComHsh",
      "salt": "saltDaSenha",
      "cargo": "funcinario",
      "descricao": "Professor",
      "nif": "1234567",
      "pis": "12345678900",
      "default_pass": true
    }
  }
```

#### 404 Not found

```
{ msg: "Usuário não encontrado." }
```

