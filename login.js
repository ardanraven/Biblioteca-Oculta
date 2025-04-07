function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const verificationCode = document.getElementById("verificationCode").value;

    // Usuário e senha fixos
    const userFixed = "decorus";
    const passFixed = "@Lucem2025#";

    // Códigos de verificação variáveis para cada mês
    const codes = {
        0: "483721",  // Janeiro
        1: "150839",  // Fevereiro
        2: "902374",  // Março
        3: "617205",  // Abril
        4: "328490",  // Maio
        5: "741683",  // Junho
        6: "296104",  // Julho
        7: "875312",  // Agosto
        8: "063958",  // Setembro
        9: "519740",  // Outubro
        10: "384216", // Novembro
        11: "207931"  // Dezembro
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
