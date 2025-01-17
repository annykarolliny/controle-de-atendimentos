document.querySelector('#submitData').addEventListener('click', function (e) {
    e.preventDefault();

    const serviceInput = document.querySelector('#servico');
    const servico = serviceInput.value.trim(); 

    if (!servico) {
        alert('O nome do serviço é obrigatório.');
        serviceInput.focus(); // Foca no campo de entrada
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
            return response.json().then(error => {
                alert(error.message); 
                throw new Error(error.message);
            });
        }
        return response.json();
    })
    .then(result => {
        alert('Serviço adicionado com sucesso!');
        document.querySelector('#form').reset(); 
        addNewService(result); 
    })
    .catch(error => console.error('Erro:', error));
});

const fetchServices = () => {
    fetch('http://localhost:8800/services/')
        .then(response => response.json())
        .then(data => {
            displayServices(data);
        })
        .catch(error => console.error('Erro ao buscar serviços:', error));
};

const displayServices = (services) => {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; 

    services.forEach(service => {
        const newLine = document.createElement('tr');
        newLine.setAttribute('data-id', service.id);

        newLine.innerHTML = `
            <td>${service.id}</td>
            <td>${service.servico}</td>
            <td class="icons">
                <a href="#" class="text-primary"><i class="fas fa-edit"></i></a>
                <a href="#" class="text-danger ms-3"><i class="fas fa-trash"></i></a>
            </td>
        `;
        tableBody.appendChild(newLine);
    });
};

const addNewService = (service) => {
    const tableBody = document.querySelector('tbody');
    const newLine = document.createElement('tr');
    newLine.setAttribute('data-id', service.id);

    newLine.innerHTML = `
        <td>${service.id}</td>
        <td>${service.servico}</td>
        <td class="icons">
            <a href="#" class="text-primary"><i class="fas fa-edit"></i></a>
            <a href="#" class="text-danger ms-3"><i class="fas fa-trash"></i></a>
        </td>
    `;
    tableBody.appendChild(newLine);
};

const editService = (e) => {
    e.preventDefault();

    if (e.target.classList.contains('fa-edit')) {
        const line = e.target.closest('tr');
        const id = line.dataset.id;
        const currentService = line.children[1].textContent;

        document.querySelector('#editServiceInput').value = currentService;
        
        const editModal = new bootstrap.Modal(document.querySelector('#editServiceModal'));
        editModal.show();

        document.querySelector('#editServiceBtn').onclick = async function () {
            const updatedService = document.querySelector('#editServiceInput').value.trim();

            if (!updatedService) {
                alert('O nome do serviço não pode estar vazio!');
                return;
            }

            try {
                const response = await fetch(`http://localhost:8800/services/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ servico: updatedService }),
                });

                if (response.ok) {
                    alert('Serviço atualizado com sucesso!');
                    line.children[1].textContent = updatedService; 

                    editModal.hide();
                } else {
                    alert('Erro ao atualizar o serviço.');
                }
            } catch (error) {
                console.error('Erro ao editar o serviço:', error);
                alert('Erro na conexão com o servidor.');
            }
        };
    }
};

const removeService = async (e) => {
    e.preventDefault();
    
    if (e.target.classList.contains('fa-trash')) {
        const line = e.target.closest('tr');
        const id = line.dataset.id;

        if (confirm('Tem certeza que deseja excluir este serviço?')) {
            try {
                const response = await fetch(`http://localhost:8800/services/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Serviço excluído com sucesso!');
                    line.remove();
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

document.querySelector('tbody').addEventListener('click', editService);
document.querySelector('tbody').addEventListener('click', removeService);

fetchServices();
