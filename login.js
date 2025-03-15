const repoOwner = "ardanraven"; // Substitua pelo seu usuário ou organização no GitHub
const repoName = "Biblioteca-Oculta"; // Substitua pelo nome do seu repositório
const filePath = "accounts.json"; // Caminho do arquivo no repositório
const githubToken = "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"; // Substitua pelo token gerado no GitHub

async function getAccounts() {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json"
        }
    });

    const data = await response.json();
    const content = atob(data.content); // Decodifica o conteúdo Base64
    return JSON.parse(content); // Retorna o conteúdo JSON
}

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const accounts = await getAccounts();
    const userAccount = accounts.find(acc => acc.username === username);

    if (userAccount) {
        const now = new Date();
        if (new Date(userAccount.expiration) > now && userAccount.password === password) {
            localStorage.setItem("auth", "true");
            window.location.href = "index.html";
        } else if (new Date(userAccount.expiration) <= now) {
            document.getElementById("error-message").innerText = "Conta expirada!";
        } else {
            document.getElementById("error-message").innerText = "Senha incorreta!";
        }
    } else {
        document.getElementById("error-message").innerText = "Usuário não encontrado!";
    }
}
