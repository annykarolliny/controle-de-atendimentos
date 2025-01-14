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
=======
const modalElement = document.getElementById('editAdminModal');
>>>>>>> 352fbc23c07ace13aa44445dd37def0cd5cd8b0b

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


const fetchAdms = () => {
    fetch('http://localhost:8800/adms/')
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
                <a href="#" class="text-primary" data-bs-toggle="modal" data-bs-target="#editAdminModal"><i class="fas fa-edit"></i></a>
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

const editAdm = (e) => {
    e.preventDefault();

    if (e.target.classList.contains('fa-edit')) {
        const line = e.target.closest('tr');
        const cpf = line.children[1].textContent.replace(/\D/g, ''); // Remove a formatação do CPF

        // Preenche o modal com as informações atuais
        const nome = line.children[0].textContent;
        document.querySelector('#editNome').value = nome;
        document.querySelector('#editCpf').value = line.children[1].textContent; // CPF não será editável

        // Exibe o modal
        const editModal = new bootstrap.Modal(document.querySelector('#editAdminModal'));
        editModal.show();

        // Quando o botão "Salvar" for clicado, envia a edição ao backend
        document.querySelector('#editAdminButton').onclick = async function () {
            const updatedNome = document.querySelector('#editNome').value.trim();
            const updatedSenha = document.querySelector('#editSenha').value.trim();

            try {
                const response = await fetch(`http://localhost:8800/adms/${cpf}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome: updatedNome, senha: updatedSenha }),
                });

                if (response.ok) {
                    alert('Administrador atualizado com sucesso!');
                    // Atualiza a linha da tabela com os novos dados
                    line.children[0].textContent = updatedNome;
                    line.children[2].textContent = updatedSenha;

                    editModal.hide();
                } else {
                    alert('Erro ao atualizar o administrador.');
                }
            } catch (error) {
                console.error('Erro ao editar o administrador:', error);
                alert('Erro na conexão com o servidor.');
            }
        };
    }
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

const closeModal = () => {
    const modalElement = document.getElementById('editAdminModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.hide();
};

modalElement.addEventListener('hidden.bs.modal', function () {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove(); // Remove o backdrop se ele existir
    }
});

document.querySelector('tbody').addEventListener('click', editAdm);
document.querySelector('tbody').addEventListener('click', removerAdm);
document.querySelector('.btn-close').addEventListener('click', closeModal);

fetchAdms();
