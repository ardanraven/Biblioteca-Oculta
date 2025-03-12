function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Defina o login e senha fixo
    const userFixed = "admin";
    const passFixed = "dec0rus2025";

    if (username === userFixed && password === passFixed) {
        localStorage.setItem("auth", "true"); // Salva no navegador
        window.location.href = "index.html"; // Redireciona para a biblioteca
    } else {
        document.getElementById("error-message").innerText = "Usuário ou senha incorretos!";
    }
}

// Bloqueia a biblioteca se não estiver logado
if (window.location.pathname.includes("index.html")) {
    if (localStorage.getItem("auth") !== "true") {
        window.location.href = "login.html";
    }
}
