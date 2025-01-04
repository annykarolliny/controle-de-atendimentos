const fetchAtendimentos = () => {
    fetch('http://localhost:8800/')
        .then(response => response.json())
        .then(dados => {
            exibirAtendimentos(dados);
        })
        .catch(error => console.error('Erro ao buscar atendimentos:', error));
};

const formatarData = (dateString) => {
    const data = new Date(dateString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
};

const exibirAtendimentos = (atendimentos) => {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; 

    atendimentos.forEach(atendimento => {
        const novaLinha = document.createElement('tr');
        const dataFormatada = formatarData(atendimento.data);
        novaLinha.setAttribute("data-id", atendimento.id);

        novaLinha.innerHTML = `
            <td>${atendimento.id}</td>
            <td>${atendimento.nome}</td>
            <td>${atendimento.sobrenome}</td>
            <td>${atendimento.telefone}</td>
            <td>${atendimento.servico}</td>
            <td>${dataFormatada}</td>
            <td>${atendimento.atendente}</td>
            <td>
                <a href="#" class="text-primary"><i class="fas fa-edit"></i></a>
                <a href="#" class="text-danger ms-3"><i class="fas fa-trash"></i></a>
            </td>
        `;
        tableBody.appendChild(novaLinha);
    });
};

document.querySelector('#submitData').addEventListener('click', function () {
    const nome = document.querySelector('[name="nome"]').value;
    const sobrenome = document.querySelector('[name="sobrenome"]').value;
    const telefone = document.querySelector('[name="telefone"]').value;
    const servico = document.querySelector('[name="servico"]').value;
    const data = document.querySelector('[name="data-atendimento"]').value;
    const atendente = document.querySelector('[name="atendente"]').value;

    const dados = { nome, sobrenome, telefone, servico, data, atendente };

    fetch('http://localhost:8800/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })
    .then(response => response.json())
    .then(result => {
        alert('Registro adicionado com sucesso!');
        document.querySelector('#form').reset();
        addNovoAtendimento(result);
    })
    .catch(error => console.error('Erro:', error));
});

const addNovoAtendimento = (atendimento) => {
    const tableBody = document.querySelector('tbody');
    const novaLinha = document.createElement('tr');
    const dataFormatada = formatarData(atendimento.data);

    novaLinha.setAttribute("data-id", atendimento.id);

    novaLinha.innerHTML = `
        <td>${atendimento.id}</td>
        <td>${atendimento.nome}</td>
        <td>${atendimento.sobrenome}</td>
        <td>${atendimento.telefone}</td>
        <td>${atendimento.servico}</td>
        <td>${dataFormatada}</td>
        <td>${atendimento.atendente}</td>
        <td>
            <a href="#" class="text-primary"><i class="fas fa-edit"></i></a>
            <a href="#" class="text-danger ms-3"><i class="fas fa-trash"></i></a>
        </td>
    `;
    tableBody.appendChild(novaLinha);
};

const removerAtendimento = async (e) => {
    e.preventDefault();
    
    if (e.target.classList.contains('fa-trash')) {
        const linha = e.target.closest('tr');
        const id = linha.dataset.id;

        if (confirm('Tem certeza que deseja excluir este registro?')) {
            try {
                const response = await fetch(`http://localhost:8800/api/records/${id}`, {
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

const editarAtendimento = async (e) => {
    e.preventDefault();

    if (e.target.classList.contains('fa-edit')) {
        const linha = e.target.closest('tr');
        const id = linha.dataset.id;

        // Coleta os dados atuais do atendimento
        const nome = linha.children[1].textContent;
        const sobrenome = linha.children[2].textContent;
        const telefone = linha.children[3].textContent;
        const servico = linha.children[4].textContent;
        const dataAtual = linha.children[5].textContent.split('/').reverse().join('-'); // Formata para ISO
        const atendente = linha.children[6].textContent;

        // Preenche o formulário do modal com os dados existentes
        document.querySelector('[name="nome"]').value = nome;
        document.querySelector('[name="sobrenome"]').value = sobrenome;
        document.querySelector('[name="telefone"]').value = telefone;
        document.querySelector('[name="servico"]').value = servico;
        document.querySelector('[name="data-atendimento"]').value = dataAtual;
        document.querySelector('[name="atendente"]').value = atendente;

        // Exibe o modal
        const modal = new bootstrap.Modal(document.querySelector('#addRecordModal'));
        modal.show();

        const botaoSalvar = document.querySelector('#submitData');
        botaoSalvar.textContent = 'Salvar';

        botaoSalvar.onclick = async function () {
            const dadosAtualizados = {
                nome: document.querySelector('[name="nome"]').value,
                sobrenome: document.querySelector('[name="sobrenome"]').value,
                telefone: document.querySelector('[name="telefone"]').value,
                servico: document.querySelector('[name="servico"]').value,
                data: document.querySelector('[name="data-atendimento"]').value,
                atendente: document.querySelector('[name="atendente"]').value,
            };

            try {
                const response = await fetch(`http://localhost:8800/api/records/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosAtualizados),
                });

                if (response.ok) {
                    alert('Registro atualizado com sucesso!');

                    // Atualiza a linha na tabela
                    linha.children[1].textContent = dadosAtualizados.nome;
                    linha.children[2].textContent = dadosAtualizados.sobrenome;
                    linha.children[3].textContent = dadosAtualizados.telefone;
                    linha.children[4].textContent = dadosAtualizados.servico;
                    linha.children[5].textContent = formatarData(dadosAtualizados.data);
                    linha.children[6].textContent = dadosAtualizados.atendente;

                    // Fecha o modal
                    modal.hide();

                    botaoSalvar.textContent = 'Cadastrar Atendimento';
                } else {
                    alert('Erro ao atualizar o registro.');
                }
            } catch (error) {
                console.error('Erro ao atualizar registro:', error);
                alert('Erro na conexão com o servidor.');
            }
        };
    }
};

document.querySelector('tbody').addEventListener('click', removerAtendimento);
document.querySelector('tbody').addEventListener('click', editarAtendimento);

// Inicializa os dados
fetchAtendimentos();
