// const fake_db_url = 'http://localhost:3000'

// const nome = document.getElementById('nome');
// const rg = document.getElementById('rg');
// const dataNascimento = document.getElementById('data_nascimento');
// const curso = document.getElementById('curso');
// const matricula = document.getElementById('matricula');
// const carteirinha_pfp = document.getElementById('carteirinha-pfp');

// const params = new URLSearchParams(window.location.search)
// const id = params.get('id')
// let dados_secao = {}

// fetch(`${fake_db_url}/alunos`)
//     .then(resposta => resposta.json()).then(dados => {
//         dados_secao = dados.filter((registro) => registro.id == id)[0]
//         console.log(dados_secao)
//         nome.innerHTML = dados_secao.nome
//         rg.innerHTML = dados_secao.rg
//         dataNascimento.innerHTML = dados_secao.data_nascimento
//         curso.innerHTML = dados_secao.curso
//         matricula.innerHTML = dados_secao.matricula
//         carteirinha_pfp.src = dados_secao.foto_perfil
//     })