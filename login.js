// Configuração da sua aplicação Firebase
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
const db = firebase.firestore();

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    if (!email || !password) {
        errorMessage.innerText = "Por favor, insira o email e a senha.";
        return;
    }

    errorMessage.style.color = "orange";
    errorMessage.innerText = "A verificar credenciais...";
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return db.collection("users").doc(user.uid).get();
        })
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const expirationDate = userData.expirationDate.toDate();
                if (new Date() < expirationDate) {
                    // SUCESSO! Apenas redireciona.
                    window.location.href = "index.html";
                } else {
                    errorMessage.style.color = "red";
                    errorMessage.innerText = "O seu acesso expirou. Fale com o administrador.";
                    auth.signOut();
                }
            } else {
                errorMessage.style.color = "red";
                errorMessage.innerText = "Erro: Dados de assinatura não encontrados.";
                auth.signOut();
            }
        })
        .catch((error) => {
            errorMessage.style.color = "red";
            errorMessage.innerText = "Email ou senha incorretos!";
        });
}
