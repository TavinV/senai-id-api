const cadastroForm = document.getElementById('cadastroForm')
const nome = document.getElementById('nome');
const rg = document.getElementById('rg');
const dataNascimento = document.getElementById('data_nascimento');
const curso = document.getElementById('curso');
const matricula = document.getElementById('matricula');
const carteirinha_pfp = document.getElementById('foto-aluno');


async function registerUser(formData) {
    console.log("register user")
    try {
        const resposta = await fetch(`http://localhost:3000/admSenaiID/registrar`, {
            method: 'POST',
            body: formData
        });

        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status}`);
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}


cadastroForm.addEventListener('submit', (e) => {
    let foto = carteirinha_pfp.files[carteirinha_pfp.files.length - 1]
    const formData = new FormData(); // Cria um novo FormData
    formData.append('adm', false);
    formData.append('nome', nome.value.trim());
    formData.append('rg', rg.value);
    formData.append('data_nascimento', dataNascimento.value);
    formData.append('curso', curso.value.trim());
    formData.append('matricula', matricula.value);
    formData.append('foto_perfil', carteirinha_pfp.files[0]); // Adiciona o arquivo ao FormData
    formData.append('login', matricula.value);
    formData.append('senha', `senai117@${rg.value.substr(0, 2)}`);

    // Envia o FormData na requisição POST
    registerUser(formData);
}) 