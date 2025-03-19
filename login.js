function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const verificationCode = document.getElementById("verificationCode").value;

    // Usuário e senha fixos
    const userFixed = "admin";
    const passFixed = "oculta2025";

    // Códigos de verificação variáveis para cada mês
    const codes = {
        0: "947312",  // Janeiro
        1: "385726",  // Fevereiro
        2: "628491",  // Março
        3: "714953",  // Abril
        4: "259684",  // Maio
        5: "837415",  // Junho
        6: "190537",  // Julho
        7: "573829",  // Agosto
        8: "462918",  // Setembro
        9: "395672",  // Outubro
        10: "841256", // Novembro
        11: "720384"  // Dezembro
    };

    // Obtém o código correto para o mês atual
    const currentMonth = new Date().getMonth();
    const correctCode = codes[currentMonth];

    if (username === userFixed && password === passFixed) {
        if (verificationCode === correctCode) {
            localStorage.setItem("auth", "true");
            window.location.href = "index.html";
        } else {
            document.getElementById("error-message").innerText = "Código de verificação incorreto!";
        }
    } else {
        document.getElementById("error-message").innerText = "Usuário ou senha incorretos!";
    }
}

// Bloqueia o site se não estiver autenticado
if (window.location.pathname.includes("index.html")) {
    if (localStorage.getItem("auth") !== "true") {
        window.location.href = "login.html";
    }
}
