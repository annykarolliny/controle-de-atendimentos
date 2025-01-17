document.querySelector('#submitData').addEventListener('click', function (e) {
    e.preventDefault(); 

    const passwordConfirmModal = new bootstrap.Modal(document.querySelector('#passwordConfirmModal'));
    document.querySelector("#cpfAtendente").value = document.querySelector('[name="atendente"] option:checked').value;
    const nome = document.querySelector('[name="nome"]').value;
    const sobrenome = document.querySelector('[name="sobrenome"]').value;
    const telefone = document.querySelector('[name="telefone"]').value;
    const servicoText = document.querySelector('[name="servico"] option:checked').textContent;
    const data = document.querySelector('[name="data-atendimento"]').value;
    const atendenteText = document.querySelector('[name="atendente"] option:checked').textContent;
    passwordConfirmModal.show();

    document.querySelector('#confirmarSenhaBtn').onclick = async function () {
        const senha = document.querySelector('#atendenteSenha').value.trim();

        const validationResponse = await validatePassword(document.querySelector("#cpfAtendente").value, senha);

        if (validationResponse.success) {
            const dados = { nome, sobrenome, telefone, servico: servicoText, data, atendente: atendenteText };

            fetch('http://localhost:8800/atendimentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => { throw new Error(err.error); });
                    }
                    return response.json(); 
                })
                .then(result => {
                    alert('Registro adicionado com sucesso!');
                    document.querySelector('#form').reset();
                    addNewAtendimento(result); 
                    passwordConfirmModal.hide();
                })
                .catch(error => {
                    alert(`Erro: ${error.message}`);
                    console.error('Erro:', error);
                });
        } else {
            document.querySelector('#senhaMensagem').classList.remove('d-none');
        }
    };
});

const validatePassword = async (cpf, senha) => {
    try {
        const response = await fetch('http://localhost:8800/adms/validate-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, senha })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, message: errorData.message || 'Senha incorreta.' };
        }

        return { success: true };
    } catch (error) {
        console.error('Erro na validação da senha:', error);
        return { success: false, message: 'Erro na conexão com o servidor.' };
    }
};

const fetchAtendimentos = () => {
    fetch('http://localhost:8800/atendimentos')
        .then(response => response.json())
        .then(data => {
            displayAtendimentos(data);
        })
        .catch(error => console.error('Erro ao buscar atendimentos:', error));
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatTel = (telefone) => {
    if (telefone.length === 11) {
        const ddd = telefone.slice(0, 2);
        const part1 = telefone.slice(2, 7);
        const part2 = telefone.slice(7);
        return `+55 (${ddd}) ${part1}-${part2}`;
    } else {
        return 'Número de telefone inválido';
    }
}

const displayAtendimentos = (atendimentos) => {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; 

    atendimentos.forEach(atendimento => {
        const newLine = document.createElement('tr');
        const formattedDate = formatDate(atendimento.data);
        const formattedTelefone = formatTel(atendimento.telefone);
        newLine.setAttribute('data-id', atendimento.id);

        newLine.innerHTML = `
            <td>${atendimento.id}</td>
            <td>${atendimento.nome}</td>
            <td>${atendimento.sobrenome}</td>
            <td>${formattedTelefone}</td>
            <td>${atendimento.servico}</td>
            <td>${formattedDate}</td>
            <td>${atendimento.atendente}</td>
            <td>
                <a href="#" class="text-primary"><i class="fas fa-edit"></i></a>
                <a href="#" class="text-danger ms-3"><i class="fas fa-trash"></i></a>
            </td>
        `;
        tableBody.appendChild(newLine);
    });
};

const addNewAtendimento = (atendimento) => {
    const tableBody = document.querySelector('tbody');   
    const formattedDate = formatDate(atendimento.data);
    const formattedTelefone = formatTel(atendimento.telefone);
    const newLine = document.createElement('tr');

    newLine.setAttribute("data-id", atendimento.id);

    newLine.innerHTML = `
        <td>${atendimento.id}</td>
        <td>${atendimento.nome}</td>
        <td>${atendimento.sobrenome}</td>
        <td>${formattedTelefone}</td>
        <td>${atendimento.servico}</td>
        <td>${formattedDate}</td>
        <td>${atendimento.atendente}</td>
        <td>
            <a href="#" class="text-primary"><i class="fas fa-edit"></i></a>
            <a href="#" class="text-danger ms-3"><i class="fas fa-trash"></i></a>
        </td>
    `;
    tableBody.appendChild(newLine);
};

document.querySelector('tbody').addEventListener('click', async function (e) {
    if (e.target.classList.contains('fa-edit')) {
        const line = e.target.closest('tr');
        const id = line.dataset.id;

        try {
            const response = await fetch(`http://localhost:8800/atendimentos/${id}`);
            const atendimento = await response.json();

            if (response.ok) {
                const selectAtendente = document.querySelector('[name="updateAtendente"]');
                selectAtendente.innerHTML = ''; 
                const atendentesResponse = await fetch('http://localhost:8800/adms');
                const atendentes = await atendentesResponse.json();
                atendentes.forEach(atendente => {
                    const option = document.createElement('option');
                    option.value = atendente.cpf;
                    option.textContent = atendente.nome;
                    if (atendente.cpf === atendimento.atendente) {
                        option.selected = true;
                    }
                    selectAtendente.appendChild(option);
                });

                const selectServico = document.querySelector('[name="updateServico"]');
                selectServico.innerHTML = ''; 
                const servicesResponse = await fetch('http://localhost:8800/services');
                const services = await servicesResponse.json();
                services.forEach(service => {
                    const option = document.createElement('option');
                    option.value = service.id;
                    option.textContent = service.servico;
                    if (service.id === atendimento.servico) {
                        option.selected = true;
                    }
                    selectServico.appendChild(option);
                });

                document.querySelector('[name="updateNome"]').value = atendimento.nome;
                document.querySelector('[name="updateSobrenome"]').value = atendimento.sobrenome;
                document.querySelector('[name="updateTelefone"]').value = atendimento.telefone;
                document.querySelector('[name="updateDataAtendimento"]').value = atendimento.data.split('T')[0];

                const updateModal = new bootstrap.Modal(document.querySelector('#updateRecordModal'));
                updateModal.show();

                document.querySelector('#updateDataBtn').dataset.id = id;
            } else {
                alert('Erro ao carregar dados para edição.');
            }
        } catch (error) {
            console.error('Erro ao buscar atendimento:', error);
        }
    }
});

document.querySelector('#updateDataBtn').addEventListener('click', async function () {
    const id = this.dataset.id; 
    const nome = document.querySelector('[name="updateNome"]').value.trim();
    const sobrenome = document.querySelector('[name="updateSobrenome"]').value.trim();
    const telefone = document.querySelector('[name="updateTelefone"]').value.trim();
    const data = document.querySelector('[name="updateDataAtendimento"]').value;

    const atendente = document.querySelector('[name="updateAtendente"] option:checked').textContent.trim();
    const servico = document.querySelector('[name="updateServico"] option:checked').textContent.trim();

    const dadosAtualizados = { nome, sobrenome, telefone, data, atendente, servico };

    try {
        const response = await fetch(`http://localhost:8800/atendimentos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados),
        });

        if (response.ok) {
            await atualizarAgricultor(nome, sobrenome, telefone);

            alert('Registro atualizado com sucesso!');
            location.reload(); 
        } else {
            alert('Erro ao atualizar o registro.');
        }
    } catch (error) {
        console.error('Erro ao atualizar o registro:', error);
    }
});

const atualizarAgricultor = async (nome, sobrenome, telefone) => {
    const dados = { nome, sobrenome, telefone };

    try {
        const response = await fetch(`http://localhost:8800/agricultores/${telefone}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            console.log('Agricultor atualizado com sucesso!');
        } else {
            console.error('Erro ao atualizar agricultor:', response.statusText);
        }
    } catch (error) {
        console.error('Erro na conexão com o servidor:', error);
    }
};

const removerAtendimento = async (e) => {
    e.preventDefault();
    
    if (e.target.classList.contains('fa-trash')) {
        const line = e.target.closest('tr');
        const id = line.dataset.id;

        if (confirm('Tem certeza que deseja excluir este registro?')) {
            try {
                const response = await fetch(`http://localhost:8800/atendimentos/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Atendimento excluído com sucesso!');
                    line.remove();
                } else if (response.status === 404) {
                    alert('Atendimento não encontrado.');
                } else {
                    alert('Erro ao excluir o atendimento.');
                }
            } catch (error) {
                console.error('Erro ao excluir atendimento:', error);
                alert('Erro na conexão com o servidor.');
            }
        }
    }
};

const loadAtendentes = async () => {
    const selectAtendente = document.querySelector('#select-atendente');

    try {
        const response = await fetch('http://localhost:8800/adms');
        
        if (!response.ok) {
            throw new Error('Erro ao carregar atendentes');
        }

        const atendentes = await response.json();

        atendentes.forEach(atendente => {
            const option = document.createElement('option');
            option.value = atendente.cpf;
            option.textContent = atendente.nome;
            selectAtendente.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert('Não foi possível carregar os atendentes.');
    }
}

const loadServices = async () => {
    const selectServices = document.querySelector('#select-servicos');

    try {
        const response = await fetch('http://localhost:8800/services');
        
        if (!response.ok) {
            throw new Error('Erro ao carregar serviços');
        }

        const services = await response.json();

        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = service.servico;
            selectServices.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert('Não foi possível carregar os serviços.');
    }
}

document.querySelector('tbody').addEventListener('click', removerAtendimento);

fetchAtendimentos();
loadAtendentes();
loadServices();