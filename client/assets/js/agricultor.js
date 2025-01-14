document.querySelector('#submitData').addEventListener('click', function () {
    const nome = document.querySelector('[name="nome"]').value;
    const sobrenome = document.querySelector('[name="sobrenome"]').value;
    const telefone = document.querySelector('[name="telefone"]').value;

    const dados = { nome, sobrenome, telefone }

    fetch('http://localhost:8800/agricultores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        })
        .then(response => response.json())
        .then(result => {
            document.querySelector('#form').reset();
        })
        .catch(error => console.error('Erro:', error));
});

const removerAgricultor = async (e) => {
    e.preventDefault();
    
    if (e.target.classList.contains('fa-trash')) {
        const line = e.target.closest('tr');
        const telefone = line.children[3].textContent.replace(/\D/g, '').replace(/^.{2}/, '');
        console.log(telefone);

        try {
            const response = await fetch(`http://localhost:8800/agricultores/${telefone}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Agricultor excluído com sucesso!');
                line.remove();
            } else if (response.status === 404) {
                alert('Agricultor não encontrado.');
            } else if (response.status === 400) {
                alert('O agricultor não pode ser excluído pois está associado a atendimentos.');
            } else {
                alert('Erro ao excluir o agricultor.');
            }
        } catch (error) {
            console.error('Erro ao excluir agricultor:', error);
            alert('Erro na conexão com o servidor.');
        }
    }
};


document.querySelector('tbody').addEventListener('click', removerAgricultor);