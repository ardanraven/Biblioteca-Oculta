// Configuração do seu app do Firebase
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

/**
 * Cria um novo usuário no Firebase Authentication e salva a data de validade no Firestore.
 */
function createUser() {
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const validityMonths = parseInt(document.getElementById('validity').value);
    const messageEl = document.getElementById('admin-message');

    // Validação de entrada
    if (!email || !password) {
        messageEl.textContent = "Erro: Por favor, preencha o email e a senha.";
        messageEl.style.color = "red";
        return;
    }
    if (password.length < 6) {
        messageEl.textContent = "Erro: A senha deve ter no mínimo 6 caracteres.";
        messageEl.style.color = "red";
        return;
    }

    messageEl.textContent = "Criando usuário...";
    messageEl.style.color = "orange";

    // Cria o usuário no serviço de Autenticação do Firebase
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + validityMonths);

            // Salva os detalhes do usuário no banco de dados Firestore
            return db.collection("users").doc(user.uid).set({
                email: email,
                expirationDate: firebase.firestore.Timestamp.fromDate(expirationDate),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            messageEl.textContent = `Usuário ${email} criado com sucesso!`;
            messageEl.style.color = "lightgreen";
            document.getElementById('newUserEmail').value = '';
            document.getElementById('newUserPassword').value = '';
            loadUsers(); // Atualiza a lista de usuários na tela
        })
        .catch((error) => {
            if (error.code == 'auth/email-already-in-use') {
                messageEl.textContent = "Erro: Este email já está cadastrado.";
            } else {
                messageEl.textContent = "Erro: " + error.message;
            }
            messageEl.style.color = "red";
        });
}

/**
 * Carrega e exibe a lista de usuários cadastrados no Firestore.
 */
function loadUsers() {
    const userListDiv = document.getElementById('userList');
    if (!userListDiv) return; // Checagem de segurança
    
    userListDiv.innerHTML = 'Carregando...'; 
    
    db.collection("users").orderBy("createdAt", "desc").get().then((querySnapshot) => {
        userListDiv.innerHTML = ''; // Limpa a lista antes de preencher
        if (querySnapshot.empty) {
            userListDiv.innerHTML = "<p>Nenhum usuário cadastrado ainda.</p>";
            return;
        }
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const expiration = userData.expirationDate.toDate().toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            const userEl = document.createElement('p');
            userEl.textContent = `📧 Email: ${userData.email} | ⏳ Expira em: ${expiration}`;
            userListDiv.appendChild(userEl);
        });
    }).catch(err => {
        console.error("Erro ao carregar usuários: ", err);
        userListDiv.innerHTML = "<p style='color:red;'>Erro ao carregar lista de usuários.</p>";
    });
}

// Garante que o código só rode depois que a página carregou completamente
window.onload = function() {
    // É uma boa prática deslogar de qualquer conta no painel de admin
    // para evitar conflitos de permissão no futuro.
    auth.signOut(); 
    loadUsers();
};
