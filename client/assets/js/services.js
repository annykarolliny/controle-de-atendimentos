const fetchServices = () => {
    fetch('http://localhost:8800/services/')
        .then(response => response.json())
        .then(dados => {
            exibirServicos(dados);
        })
        .catch(error => console.error('Erro ao buscar atendimentos:', error));
};

const exibirServicos = (services) => {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; 

    services.forEach(service => {
        const novaLinha = document.createElement('tr');
        novaLinha.setAttribute("data-id", service.id);

        novaLinha.innerHTML = `
            <td>${service.id}</td>
            <td>${service.servico}</td>
            <td class="icons">
                <a href="#" class="text-primary"><i class="fas fa-edit"></i></a>
                <a href="#" class="text-danger ms-3"><i class="fas fa-trash"></i></a>
            </td>
        `;
        tableBody.appendChild(novaLinha);
    });
};

const addNovoService = (service) => {
    const tableBody = document.querySelector('tbody');
    const novaLinha = document.createElement('tr');
    novaLinha.setAttribute("data-id", service.id);

    novaLinha.innerHTML = `
        <td>${service.id}</td>
        <td>${service.servico}</td>
        <td class="icons">
            <a href="#" class="text-primary"><i class="fas fa-edit"></i></a>
            <a href="#" class="text-danger ms-3"><i class="fas fa-trash"></i></a>
        </td>
    `;
    tableBody.appendChild(novaLinha);
};

const removerService = async (e) => {
    e.preventDefault();
    
    if (e.target.classList.contains('fa-trash')) {
        const linha = e.target.closest('tr');
        const id = linha.dataset.id;

        if (confirm('Tem certeza que deseja excluir este serviço?')) {
            try {
                const response = await fetch(`http://localhost:8800/services/api/records/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Serviço excluído com sucesso!');
                    linha.remove();
                } else if (response.status === 404) {
                    alert('Serviço não encontrado.');
                } else {
                    alert('Erro ao excluir o serviço.');
                }
            } catch (error) {
                console.error('Erro ao excluir serviço:', error);
                alert('Erro na conexão com o servidor.');
            }
        }
    }
};

document.querySelector('#submitData').addEventListener('click', function (e) {
    e.preventDefault();

    const servicoInput = document.querySelector('#servico');
    const servico = servicoInput.value.trim(); // Remove espaços extras

    // Validação: nome do serviço obrigatório
    if (!servico) {
        alert("O nome do serviço é obrigatório.");
        servicoInput.focus(); // Foca no campo de entrada
        return;
    }

    const dados = { servico };

    fetch('http://localhost:8800/services/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })
    .then(response => {
        if (!response.ok) {
            // Verifica se a resposta contém erro de serviço duplicado
            return response.json().then(error => {
                alert(error.message); // Exibe a mensagem de erro
                throw new Error(error.message);
            });
        }
        return response.json();
    })
    .then(result => {
        alert('Serviço adicionado com sucesso!');
        document.querySelector('#form').reset(); // Limpa o formulário
        addNovoService(result); // Adiciona o novo serviço na tabela
    })
    .catch(error => console.error('Erro:', error));
});


// document.querySelector('#submitData').addEventListener('click', function (e) {
//     e.preventDefault();

//     const servico = document.querySelector('#servico').value;

//     const dados = { servico };

//     fetch('http://localhost:8800/services/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(dados),
//     })
//     .then(response => response.json())
//     .then(result => {
//         alert('Serviço adicionado com sucesso!');
//         document.querySelector('#form').reset();
//         addNovoService(result);
//     })
//     .catch(error => console.error('Erro:', error));
// });

document.querySelector('tbody').addEventListener('click', removerService);

fetchServices();
