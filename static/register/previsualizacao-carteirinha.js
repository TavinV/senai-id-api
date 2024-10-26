// Inputs
const nomeInput = document.getElementById('nome');
const rgInput = document.getElementById('rg');
const dataNascimentoInput = document.getElementById('data_nascimento');
const cursoInput = document.getElementById('curso');
const matriculaInput = document.getElementById('matricula');
const carteirinha_pfp_input = document.getElementById('foto-aluno');

// Elementos da pré-visualização da carteirinha
const nomePrevisu = document.getElementById('nome_previsu');
const rgPrevisu = document.getElementById('rg_previsu');
const matriculaPrevisu = document.getElementById('matricula_previsu');
const dataNascimentoPrevisu = document.getElementById('data_nascimento_previsu');
const cursoPrevisu = document.getElementById('curso_previsu');
const carteirinhaPFP = document.getElementById('carteirinha-pfp')

// Função para atualizar os valores da pré-visualização
function atualizarPrevisu() {
    nomePrevisu.textContent = nomeInput.value || '-'; // Texto padrão se vazio
    rgPrevisu.textContent = rgInput.value || '-';
    matriculaPrevisu.textContent = matriculaInput.value || '-';
    dataNascimentoPrevisu.textContent = dataNascimentoInput.value || '-';
    cursoPrevisu.textContent = cursoInput.value || 'Curso';
}

// Adicionar eventos de input para atualizar a pré-visualização
nomeInput.addEventListener('input', atualizarPrevisu);
rgInput.addEventListener('input', atualizarPrevisu);
dataNascimentoInput.addEventListener('input', atualizarPrevisu);
cursoInput.addEventListener('input', atualizarPrevisu);
matriculaInput.addEventListener('input', atualizarPrevisu);

// Chamar a função uma vez para garantir que a pré-visualização comece com o valor correto
atualizarPrevisu();

// Carregar a foto de perfil

carteirinha_pfp_input.addEventListener('change', (e) => {
    if (e.target.files.length === 0) {
        alert('Sem arquivos')
    } else {
        const file = e.target.files[0];
        const reader = new FileReader();

        // Função para quando o arquivo for carregado
        reader.onload = function (event) {
            const imageUrl = event.target.result; // Este é o link da imagem

            // Aqui você pode adicionar a imagem ao HTML, por exemplo, em um elemento <img>
            carteirinhaPFP.src = imageUrl
        };

        reader.readAsDataURL(file);
    }
})