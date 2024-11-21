# Senai ID

API REST Para o projeto de TCC do curso de Desenvolvimento de sistemas da turma I1P - Senai Nami Jafet


## Documentação da API

### Login

```http
  POST /api/login
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `login`      | `string`  | **Obrigatório**. Login do usuário |
| `senha`      | `string`  | **Obrigatório**. Senha do usuário |

### Resposta
#### Caso o login seja efetuado com sucesso, a resposta será a seguinte:

```
    Status: 200

    Data: {
        cargo: "Aluno",
        token: "token_JWT"
    } 
```
O token contem o cargo da conta e o seu ID.

### Carteirinha
```http
  GET /api/carteirinha/
```
