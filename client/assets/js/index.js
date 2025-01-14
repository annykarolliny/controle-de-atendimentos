const fetchAtendimentos = () => {
    fetch('http://localhost:8800/atendimentos')
        .then(response => response.json())
        .then(data => {
            displayAtendimentos(data);
        })
        .catch(error => console.error('Erro ao buscar atendimentos:', error));
};

// const fetchAtendimentos = () => {
//     fetch('http://localhost:8800/atendimentos')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Erro na resposta do servidor: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             const atendimentos = data.rows || []; // Acesse a propriedade `rows` e use um array vazio como fallback
//             displayAtendimentos(atendimentos);
//         })
//         .catch(error => console.error('Erro ao buscar atendimentos:', error));
// };

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

document.querySelector('#submitData').addEventListener('click', function () {
    const nome = document.querySelector('[name="nome"]').value;
    const sobrenome = document.querySelector('[name="sobrenome"]').value;
    const telefone = document.querySelector('[name="telefone"]').value;
    const servicoText = document.querySelector('[name="servico"] option:checked').textContent;
    const data = document.querySelector('[name="data-atendimento"]').value;
    const atendenteText = document.querySelector('[name="atendente"] option:checked').textContent;

    const dados = { nome, sobrenome, telefone, servico: servicoText, data, atendente: atendenteText };

    fetch('http://localhost:8800/atendimentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })
        .then(response => {
            // Verifica se a resposta foi bem-sucedida
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error); });
            }
            return response.json(); // Retorna os dados para o próximo `then`
        })
        .then(result => {
            // Se a resposta foi bem-sucedida, adiciona o novo atendimento
            alert('Registro adicionado com sucesso!');
            document.querySelector('#form').reset();
            addNewAtendimento(result); // Chama somente com dados válidos
        })
        .catch(error => {
            // Trata o erro sem adicionar lines "undefined"
            alert(`Erro: ${error.message}`);
            console.error('Erro:', error);
        });
    

    // fetch('http://localhost:8800/', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(dados),
    // })
    // .then(response => response.json())
    // .then(result => {
    //     alert('Registro adicionado com sucesso!');
    //     document.querySelector('#form').reset();
    //     addNewAtendimento(result);
    // })
    // .catch(error => console.error('Erro:', error));
});

const atendimentoAlreadyExisting = (atendimento) => {
    const lines = document.querySelectorAll('tbody tr');
    return Array.from(lines).some((line) => {
        const cells = line.children;
        return (
            cells[1].textContent === atendimento.nome &&
            cells[2].textContent === atendimento.sobrenome &&
            cells[3].textContent === atendimento.telefone &&
            cells[4].textContent === atendimento.servico &&
            cells[5].textContent === formatDate(atendimento.data) &&
            cells[6].textContent === atendimento.atendente
        );
    });
};

const addNewAtendimento = (atendimento) => {
    const tableBody = document.querySelector('tbody');   
    const formattedDate = formatDate(atendimento.data);
    const formattedTelefone = formatTel(atendimento.telefone);

    if (atendimentoAlreadyExisting(atendimento)) {
        alert('Esse atendimento já está cadastrado!');
        return;
    }

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
    // alert('Registro adicionado com sucesso!');
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

// const removerAtendimento = async (e) => {
//     e.preventDefault();

//     if (e.target.classList.contains('fa-trash')) {
//         const line = e.target.closest('tr');
//         const id = line.dataset.id;

//         if (confirm('Tem certeza que deseja excluir este registro?')) {
//             try {
//                 // Primeiro, exclui o atendimento
//                 const response = await fetch(`http://localhost:8800/atendimentos/${id}`, {
//                     method: 'DELETE',
//                 });

//                 if (response.ok) {
//                     const data = await response.json(); // Obtém a resposta com o telefone

//                     alert('Atendimento excluído com sucesso!');
//                     line.remove();

//                     // Verifica se o telefone foi retornado para excluir o agricultor
//                     const telefone = data.telefone;
//                     if (telefone) {
//                         const agricultorResponse = await fetch(`http://localhost:8800/agricultores/${telefone}`, {
//                             method: 'DELETE',
//                         });

//                         if (agricultorResponse.ok) {
//                             alert('Agricultor associado excluído com sucesso!');
//                         } else if (agricultorResponse.status === 404) {
//                             alert('Agricultor não encontrado.');
//                         } else {
//                             alert('Erro ao excluir o agricultor associado.');
//                         }
//                     } else {
//                         alert('Telefone do agricultor não foi retornado.');
//                     }
//                 } else if (response.status === 404) {
//                     alert('Atendimento não encontrado.');
//                 } else {
//                     alert('Erro ao excluir o atendimento.');
//                 }
//             } catch (error) {
//                 console.error('Erro ao excluir atendimento:', error);
//                 alert('Erro na conexão com o servidor.');
//             }
//         }
//     }
// };

// const loadAtendentes = async () => {
//     const selectAtendente = document.querySelector('#select-atendente');

//     try {
//         const response = await fetch('http://localhost:8800/adms');
        
//         if (!response.ok) {
//             throw new Error('Erro ao carregar atendentes');
//         }

//         const data = await response.json();

//         // Verifique se os atendentes estão dentro de `data.rows`
//         const atendentes = data.rows || data; // Use `data.rows` se disponível, caso contrário, use `data` diretamente

//         if (!Array.isArray(atendentes)) {
//             throw new Error('Formato de dados inesperado: atendentes não é um array.');
//         }

//         atendentes.forEach(atendente => {
//             const option = document.createElement('option');
//             option.value = atendente.cpf;
//             option.textContent = atendente.nome;
//             selectAtendente.appendChild(option);
//         });
//     } catch (error) {
//         console.error(error);
//         alert('Não foi possível carregar os atendentes.');
//     }
// };


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
            // option.value = atendente.nome;
            option.value = atendente.cpf;
            option.textContent = atendente.nome;
            selectAtendente.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert('Não foi possível carregar os atendentes.');
    }
}

// const loadServices = async () => {
//     const selectServices = document.querySelector('#select-servicos');

//     try {
//         const response = await fetch('http://localhost:8800/services');
        
//         if (!response.ok) {
//             throw new Error('Erro ao carregar serviços');
//         }

//         const data = await response.json();

//         // Verifique se os serviços estão dentro de `data.rows`
//         const services = data.rows || data; // Use `data.rows` se disponível, senão use `data` diretamente

//         if (!Array.isArray(services)) {
//             throw new Error('Formato de dados inesperado: serviços não é um array.');
//         }

//         services.forEach(service => {
//             const option = document.createElement('option');
//             option.value = service.id; // Identificador único para o serviço
//             option.textContent = service.servico; // Nome do serviço a ser exibido
//             selectServices.appendChild(option);
//         });
//     } catch (error) {
//         console.error(error);
//         alert('Não foi possível carregar os serviços.');
//     }
// };


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
            // option.value = service.servico;
            option.value = service.id;
            option.textContent = service.servico;
            selectServices.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert('Não foi possível carregar os serviços.');
    }
}

const editarAtendimento = async (e) => {
    e.preventDefault();

    if (e.target.classList.contains('fa-edit')) {
        const line = e.target.closest('tr');
        const id = line.dataset.id;

        // Coleta os dados atuais do atendimento
        const nome = line.children[1].textContent;
        const sobrenome = line.children[2].textContent;
        const telefone = line.children[3].textContent;
        const servico = line.children[4].textContent;
        const dataAtual = line.children[5].textContent.split('/').reverse().join('-'); // Formata para ISO
        const atendente = line.children[6].textContent;

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
                const response = await fetch(`http://localhost:8800/atendimentos/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosAtualizados),
                });

                if (response.ok) {
                    alert('Registro atualizado com sucesso!');

                    // Atualiza a line na tabela
                    line.children[1].textContent = dadosAtualizados.nome;
                    line.children[2].textContent = dadosAtualizados.sobrenome;
                    line.children[3].textContent = dadosAtualizados.telefone;
                    line.children[4].textContent = dadosAtualizados.servico;
                    line.children[5].textContent = formatDate(dadosAtualizados.data);
                    line.children[6].textContent = dadosAtualizados.atendente;

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
loadAtendentes();
loadServices();
