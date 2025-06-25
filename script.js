// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBAtmQnb8pNUka-Li7EnyWnMSgzRIZ3-Dw",
  authDomain: "loginsbiblioteca.firebaseapp.com",
  projectId: "loginsbiblioteca",
  storageBucket: "loginsbiblioteca.appspot.com",
  messagingSenderId: "750396903514",
  appId: "1:750396903514:web:a22d0e3a3f61778173c863",
  measurementId: "G-1SCRFQ6ZZ7"
};

// Inicializa o Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// --- MÉTODO DE AUTENTICAÇÃO OFICIAL DO FIREBASE ---
// O onAuthStateChanged verifica DIRETAMENTE com o Firebase se há um utilizador logado.
// A verificação antiga do localStorage foi REMOVIDA.
auth.onAuthStateChanged(user => {
    if (user) {
        // UTILIZADOR ESTÁ LOGADO!
        // A lógica da biblioteca é executada aqui, e a página não será redirecionada.
        loadLibrary();
    } else {
        // NÃO HÁ UTILIZADOR LOGADO!
        // Redireciona para a página de login de forma segura.
        window.location.href = 'login.html';
    }
});


// ---- LÓGICA DA BIBLIOTECA (AGORA DENTRO DE UMA FUNÇÃO) ----

function loadLibrary() {
    // URLs dos seus Google Apps Scripts
    const scriptUrl = "https://script.google.com/macros/s/AKfycbz2KCdiyX_2vLjL2FykazpJegHexdWbQHMprc0DbFXVvrQ62d1VrG5Y21ZYj4YJfJb3UQ/exec";
    const scriptUrlVariados = "https://script.google.com/macros/s/AKfycbyta87I-xp_BTLtpt7jZl29xR9t2GLsDvVDZfSY_Muqa7WB3d3-9nwFClcQntAeKrqxcQ/exec";

    let pdfData = [];

    async function getPdfList(url) {
        const loadingAnimation = document.getElementById("div1");
        if (loadingAnimation) loadingAnimation.style.display = 'flex';
        
        try {
            const response = await fetch(url);
            pdfData = await response.json();
            displayPdfList(pdfData);
        } catch (error) {
            console.error("Erro ao buscar ficheiros:", error);
            document.getElementById("pdf-list").innerHTML = "<p>Ocorreu um erro ao carregar os livros.</p>";
        } finally {
            if (loadingAnimation) loadingAnimation.style.display = 'none';
        }
    }

    function displayPdfList(data) {
        const pdfList = document.getElementById("pdf-list");
        if (!pdfList) return;
        pdfList.innerHTML = "";
        
        if (data.length === 0) {
            pdfList.innerHTML = "<p>Nenhum livro encontrado.</p>";
            return;
        }
        
        data.forEach(file => {
            const pdfItem = document.createElement("div");
            pdfItem.classList.add("pdf-item");
            pdfItem.innerHTML = `
                <img src="${file.thumbnail || 'favicon.png'}" alt="Capa de ${file.name}" class="pdf-thumbnail" onerror="this.onerror=null;this.src='favicon.png';">
                <p>${file.name}</p>
                <a href="${file.url}" target="_blank">📖 Visualizar</a>
            `;
            pdfList.appendChild(pdfItem);
        });
    }

    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("input", function() {
            const searchTerm = this.value.toLowerCase();
            const filteredData = pdfData.filter(file => file.name.toLowerCase().includes(searchTerm));
            displayPdfList(filteredData);
        });
    }

    // Carrega a lista inicial de PDFs
    getPdfList(scriptUrl);
}

// Função de logout que desconecta do Firebase
function logout() {
    auth.signOut().then(() => {
        // O observador onAuthStateChanged vai detetar a mudança e redirecionar automaticamente.
        console.log("Logout realizado com sucesso.");
    });
}
