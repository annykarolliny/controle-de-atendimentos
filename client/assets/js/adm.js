const fetchAdms = () => {
    fetch('http://localhost:8800/adms/')
        .then(response => response.json())
        .then(dados => {
            exibirAdms(dados);
        })
        .catch(error => console.error('Erro ao buscar atendimentos:', error));
};

const formatarCpf = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

const exibirAdms = (adms) => {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; 

    adms.forEach(adm => {
        const novaLinha = document.createElement('tr');
        const cpfFormatado = formatarCpf(adm.cpf);

        novaLinha.innerHTML = `
            <td>${adm.nome}</td>
            <td>${cpfFormatado}</td>
            <td class="icons">
                <a href="#" class="text-primary"><i class="fas fa-edit"></i></a>
                <a href="#" class="text-danger ms-3"><i class="fas fa-trash"></i></a>
            </td>
        `;
        tableBody.appendChild(novaLinha);
    });
};

const addNovoAdm = (adm) => {
    const tableBody = document.querySelector('tbody');
    const novaLinha = document.createElement('tr');
    const cpfFormatado = formatarCpf(adm.cpf);

    novaLinha.innerHTML = `
        <td>${adm.nome}</td>
        <td>${cpfFormatado}</td>
        <td class="icons">
            <a href="#" class="text-primary"><i class="fas fa-edit"></i></a>
            <a href="#" class="text-danger ms-3"><i class="fas fa-trash"></i></a>
        </td>
    `;
    tableBody.appendChild(novaLinha);
};

const removerAdm = async (e) => {
    e.preventDefault();
    
    if (e.target.classList.contains('fa-trash')) {
        const linha = e.target.closest('tr');
        const cpf = linha.children[1].textContent;

        if (confirm('Tem certeza que deseja excluir este registro?')) {
            try {
                const response = await fetch(`http://localhost:8800/adms/api/records/${cpf}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Registro excluído com sucesso!');
                    linha.remove();
                } else if (response.status === 404) {
                    alert('Registro não encontrado.');
                } else {
                    alert('Erro ao excluir o registro.');
                }
            } catch (error) {
                console.error('Erro ao excluir registro:', error);
                alert('Erro na conexão com o servidor.');
            }
        }
    }
};

document.querySelector('#submitData').addEventListener('click', function (e) {
    e.preventDefault();

    const nome = document.querySelector('#nome').value;
    const cpf = document.querySelector('#cpf').value;

    const dados = { nome, cpf };

    fetch('http://localhost:8800/adms/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })
    .then(response => response.json())
    .then(result => {
        alert('Administrador adicionado com sucesso!');
        document.querySelector('#form').reset();
        addNovoAdm(result);
    })
    .catch(error => console.error('Erro:', error));
});

document.querySelector('tbody').addEventListener('click', removerAdm);

fetchAdms();