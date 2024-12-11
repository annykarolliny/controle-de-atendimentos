document.querySelector('#submitData').addEventListener('click', function () {
    const nome = document.querySelector('[name="nome"]').value;
    const sobrenome = document.querySelector('[name="sobrenome"]').value;
    const telefone = document.querySelector('[name="telefone"]').value;
    const servico = document.querySelector('[name="servico"]').value;
    const data = document.querySelector('[name="data-atendimento"]').value;
    const atendente = document.querySelector('[name="atendente"]').value;

    const dados = { 
        nome, 
        sobrenome, 
        telefone,
        servico,
        data,
        atendente
    };

    fetch('http://localhost:8800/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })
    .then(response => response.json())
    .then(result => {
        alert('Registro adicionado com sucesso!');
        document.querySelector('#form').reset();
    })
    .catch(error => console.error('Erro:', error));
});
