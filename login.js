const repoOwner = "ardanraven"; // Nome do usuário no GitHub
const repoName = "Biblioteca-Oculta"; // Nome do repositório
const filePath = "accounts.json"; // Caminho do arquivo no repositório
const githubToken = "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"; // Token gerado no GitHub

async function getAccounts() {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        if (!response.ok) throw new Error(`Erro ao buscar contas: ${response.status}`);
        const data = await response.json();
        const content = atob(data.content);
        return JSON.parse(content);
    } catch (error) {
        console.error("Erro ao obter contas:", error);
        return [];
    }
}

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
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
    } catch (error) {
        console.error("Erro ao fazer login:", error);
    }
}

// Proteção para páginas restritas
if (window.location.pathname.includes("index.html")) {
    if (localStorage.getItem("auth") !== "true") {
        window.location.href = "login.html";
    }
}
