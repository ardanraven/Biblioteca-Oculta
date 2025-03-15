const repoOwner = "ardanraven"; // Nome do seu usuário no GitHub
const repoName = "Biblioteca-Oculta"; // Nome do repositório
const filePath = "accounts.json"; // Arquivo de contas no repositório
const githubToken = "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"; // Token gerado no GitHub
const adminPassword = "judas989"; // Senha do admin

// Login do Admin
function loginAdmin() {
    const inputPassword = document.getElementById("admin-password").value;
    console.log("Senha digitada:", inputPassword);

    if (inputPassword === adminPassword) {
        console.log("Senha correta! Acessando painel...");
        document.getElementById("admin-login-section").style.display = "none";
        document.getElementById("admin-panel-section").style.display = "block";
    } else {
        console.log("Senha incorreta!");
        document.getElementById("admin-error-message").innerText = "Senha incorreta!";
    }
}

// Obter Contas
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
    console.log("Contas obtidas:", content);
    return JSON.parse(content); // Retorna o conteúdo JSON
}

// Atualizar Contas
async function updateAccounts(accounts) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json"
        }
    });
    const data = await response.json();
    const sha = data.sha;

    const updatedContent = btoa(JSON.stringify(accounts, null, 2));

    await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Atualizando contas",
            content: updatedContent,
            sha: sha
        })
    });
}

// Criar Conta
async function createAccount() {
    const username = document.getElementById("username").value;
    const validity = parseInt(document.getElementById("validity").value);

    if (!username) {
        alert("Por favor, insira um nome de usuário.");
        return;
    }

    const password = generatePassword();
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + validity);

    const newAccount = {
        username: username,
        password: password,
        expiration: expirationDate.toISOString()
    };

    const accounts = await getAccounts();
    accounts.push(newAccount);
    await updateAccounts(accounts);

    alert(`Conta criada com sucesso!\nUsuário: ${username}\nSenha: ${password}`);
}

// Gerar Senha
function generatePassword(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}
