const db = new PouchDB('carbon_footprint');  //Criação do banco de dados local usando PouchDB

function saveData(formData) {  // Função responsável por salvar os dados do formulário no banco de dados
    return db.put({
        _id: new Date().toISOString(),  // Gera um ID único com base na data atual 
        formData: formData
    });
}
// Bloco que busca todos os dados salvos no banco e monta uma tabela para exibição
function displaySavedData() {
    db.allDocs({ include_docs: true, descending: true })   // Busca todos os documentos do banco de dados em ordem decrescente
        .then(function (result) {
            const savedDataDiv = document.getElementById('savedData');  // Substitui o conteúdo anterior por um novo título e tabela
            savedDataDiv.innerHTML = '<h2 class="text-xl font-semibold text-gray-800">Dados Salvos</h2>';
            const table = document.createElement('table'); // Criação de uma tabela para exibir os dados salvos
            table.classList.add('mt-4', 'w-full', 'border', 'border-gray-200', 'divide-y', 'divide-gray-200');
            // Criação do cabeçalho da tabela
            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const header1 = document.createElement('th');
            header1.textContent = 'Data';
            const header2 = document.createElement('th');
            header2.textContent = 'Combustível (litros)';
            const header3 = document.createElement('th');
            header3.textContent = 'Tipo de Combustível';
            const header4 = document.createElement('th');
            header4.textContent = 'Distância Percorrida (km)';
            
            // Monta a linha de cabeçalho
            headerRow.appendChild(header1);
            headerRow.appendChild(header2);
            headerRow.appendChild(header3);
            headerRow.appendChild(header4);
            tableHeader.appendChild(headerRow);
            table.appendChild(tableHeader);


            // Corpo da tabela: aqui são criadas as linhas com os dados recuperados do banco local.
            // Cada linha representa um conjunto de informações preenchido anteriormente no formulário.
            const tableBody = document.createElement('tbody');
            result.rows.forEach(function (row) {
                const doc = row.doc;
                const dataRow = document.createElement('tr');
                const dateCell = document.createElement('td');
                dateCell.textContent = new Date(doc._id).toLocaleString();  // Converte o ID para data legível
                const formData = doc.formData;
                const fuelCell = document.createElement('td');
                fuelCell.textContent = formData.fuel;
                const fuelTypeCell = document.createElement('td');
                fuelTypeCell.textContent = formData.fuelType;
                const distanceCell = document.createElement('td');
                distanceCell.textContent = formData.distance;

                // Adiciona as células à linha de dados e, em seguida, adiciona a linha ao corpo da tabela
                dataRow.appendChild(dateCell);
                dataRow.appendChild(fuelCell);
                dataRow.appendChild(fuelTypeCell);
                dataRow.appendChild(distanceCell);
                tableBody.appendChild(dataRow);
            });
            table.appendChild(tableBody);
            savedDataDiv.appendChild(table); // Adiciona a tabela ao elemento de exibição
        }).catch(function (err) {
            console.log(err);  // Exibe erros no console se algo falhar
        });
}

document.getElementById('carbonForm').addEventListener('submit', function (event) {  // Evento que intercepta o envio do formulário para salvar os dados no banco
    event.preventDefault();  // Impede o comportamento padrão de recarregar a página quando o formulário é enviado
    const formData = {  //// Coleta os dados do formulário e converte os valores para os tipos adequados
        fuel: parseFloat(document.getElementById('fuel').value),  // Converte string do input em número decimal (litros)
        fuelType: document.getElementById('fuelType').value,  // Coleta o tipo de combustível selecionado
        distance: parseFloat(document.getElementById('distance').value)  // Converte string em número decimal (distância percorrida)
    };

     // Salva os dados usando a função saveData e, após salvar, atualiza a exibição da tabela com displaySavedData Isso garante que o dado inserido apareça logo após ser salvo
    saveData(formData).then(function () {
        displaySavedData(); // Recarrega a tabela com os dados atualizados
    }).catch(function (err) {
        console.log(err);  // Em caso de erro, exibe no console para depuração
    });
});
// Evento que carrega os dados salvos ao clicar no botão "Carregar Dados"
document.getElementById('saveDataBtn').addEventListener('click', function () {
    const formData = {
        fuel: parseFloat(document.getElementById('fuel').value),
        fuelType: document.getElementById('fuelType').value,
        distance: parseFloat(document.getElementById('distance').value)
    };
    saveData(formData).then(function () {  // Função para salvar os dados do formulário e notificar o usuário com um alerta simples
        alert('Dados salvos com sucesso!');  // Exibe uma mensagem de confirmação para o usuário
    }).catch(function (err) {
        console.log(err); // Em caso de erro, registra no console para facilitar a identificação do problema
    });
});
// Evento do botão "Carregar Tabela"
document.getElementById('loadTableBtn').addEventListener('click', function () {
    displaySavedData(); // Atualiza a visualização da tabela com os dados salvos no banco
});

