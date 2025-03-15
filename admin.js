const repoOwner = "ardanraven"; // Substitua pelo nome do seu usuário ou organização no GitHub
const repoName = "Biblioteca-Oculta"; // Substitua pelo nome do repositório
const filePath = "accounts.json"; // Caminho do arquivo no repositório
const githubToken = "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"; // Substitua pelo token gerado no GitHub
const adminPassword = "judas989"; // Senha do admin

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

async function updateAccounts(accounts) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    
    // Busca o SHA atual do arquivo (necessário para commit)
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json"
        }
    });
    const data = await response.json();
    const sha = data.sha;

    // Codifica o novo conteúdo em Base64
    const updatedContent = btoa(JSON.stringify(accounts, null, 2));

    // Atualiza o arquivo no GitHub
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

    // Obtém contas existentes, adiciona a nova conta e atualiza o arquivo
    const accounts = await getAccounts();
    accounts.push(newAccount);
    await updateAccounts(accounts);

    alert(`Conta criada com sucesso!\nUsuário: ${username}\nSenha: ${password}`);
}

function generatePassword(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}
