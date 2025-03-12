// Verifica se o usuário está autenticado antes de carregar a biblioteca
if (localStorage.getItem("auth") !== "true") {
    window.location.href = "login.html"; // Redireciona para o login
}

const scriptUrl = "https://script.google.com/macros/s/AKfycbz2KCdiyX_2vLjL2FykazpJegHexdWbQHMprc0DbFXVvrQ62d1VrG5Y21ZYj4YJfJb3UQ/exec"; // Link do Apps Script
let pdfData = []; // Variável para armazenar os PDFs

async function getPdfList() {
    try {
        let response = await fetch(scriptUrl);
        pdfData = await response.json(); // Armazena os PDFs na variável global
        displayPdfList(pdfData); // Chama a função para exibir os livros
    } catch (error) {
        console.error("Erro ao buscar arquivos:", error);
    }
}

function displayPdfList(data) {
    let pdfList = document.getElementById("pdf-list");
    pdfList.innerHTML = "";

    data.forEach(file => {
        let pdfItem = document.createElement("div");
        pdfItem.classList.add("pdf-item");

        pdfItem.innerHTML = `
            <img src="${file.thumbnail}" alt="Capa de ${file.name}" class="pdf-thumbnail">
            <p>${file.name}</p>
            <a href="${file.url}" target="_blank">📖 Visualizar</a>
        `;

        pdfList.appendChild(pdfItem);
    });
}

// Função de pesquisa
document.getElementById("search").addEventListener("input", function() {
    let searchTerm = this.value.toLowerCase();
    let filteredData = pdfData.filter(file => file.name.toLowerCase().includes(searchTerm));
    displayPdfList(filteredData);
});

// Chama a função inicial para carregar os PDFs
getPdfList();

function logout() {
    localStorage.removeItem("auth"); // Remove a autenticação
    window.location.href = "login.html"; // Redireciona para a tela de login
}
