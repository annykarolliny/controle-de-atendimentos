const fetchAdms = () => {
    fetch('http://localhost:8800/adms')
        .then(response => response.json())
        .then(data => {
            displayAdms(data);
        })
        .catch(error => console.error('Erro ao buscar os administradores:', error));
};

const formatCpf = (cpf) => {
    if (!cpf || typeof cpf !== 'string') {
        console.error('CPF inválido');
        return '';
    }

    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

const displayAdms = (adms) => {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; 

    adms.forEach(adm => {
        const newLine = document.createElement('tr');

        if (adm.cpf === '') {
            console.error('CPF inválido');
            return;
        }

        const formattedCpf = formatCpf(adm.cpf);

        newLine.innerHTML = `
            <td>${adm.nome}</td>
            <td>${formattedCpf}</td>
            <td class="icons">
                <a href="#" class="text-primary"><i class="fas fa-edit"></i></a>
                <a href="#" class="text-danger ms-3"><i class="fas fa-trash"></i></a>
            </td>
        `;
        tableBody.appendChild(newLine);
    });
};

const addNovoAdm = (adm) => {
    const tableBody = document.querySelector('tbody');
    const newLine = document.createElement('tr');
    const formattedCpf = formatCpf(adm.cpf);

    newLine.innerHTML = `
        <td>${adm.nome}</td>
        <td>${formattedCpf}</td>
        <td class="icons">
            <a href="#" class="text-primary"><i class="fas fa-edit"></i></a>
            <a href="#" class="text-danger ms-3"><i class="fas fa-trash"></i></a>
        </td>
    `;
    tableBody.appendChild(newLine);
};

const removerAdm = async (e) => {
    e.preventDefault();
    
    if (e.target.classList.contains('fa-trash')) {
        const line = e.target.closest('tr');
        const formattedCpf = line.children[1].textContent;
        const cpf = formattedCpf.replace(/\D/g, '');

        if (confirm('Tem certeza que deseja excluir este registro?')) {
            try {
                const response = await fetch(`http://localhost:8800/adms/${cpf}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Administrador excluído com sucesso!');
                    line.remove();
                } else if (response.status === 404) {
                    alert('Administrador não encontrado.');
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
    const senha = document.querySelector('#senha').value;

    if (!formatCpf(cpf)) {
        alert("CPF inválido.");
        return;
    }

    const dados = { nome, cpf, senha };

    fetch('http://localhost:8800/adms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })
    .then(response => {
        if (!response.ok) {
            // Verifica se a resposta contém erro de CPF duplicado
            return response.json().then(error => {
                alert(error.message); 
                throw new Error(error.message);
            });
        }
        return response.json();
    })
    .then(result => {
        alert('Administrador adicionado com sucesso!');
        document.querySelector('#form').reset();
        addNovoAdm(result);
    })
    .catch(error => console.error('Erro:', error));
});

document.querySelector('tbody').addEventListener('click', removerAdm);

fetchAdms();
