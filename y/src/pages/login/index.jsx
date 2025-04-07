import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../assets/logo.svg";
import { auth, database } from "../../servicos/firebaseConfig"; 
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { ref, get } from "firebase/database"; 
import "./styles.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

    useEffect(() => {
      if (user) {
        const userId = user.user.uid;
    
        // Primeiro, busca na coleção "usuarios"
        const userRef = ref(database, `usuarios/${userId}`);
    
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              if (userData.cpf) {
                navigate("/tela_inicial"); // Cliente
              } else {
                setMessage("Erro ao identificar usuário!");
              }
            } else {
              // Se não encontrar em "usuarios", busca na coleção "administradores"
              const adminRef = ref(database, `administradores/${userId}/documento`);
    
              get(adminRef)
                .then((adminSnapshot) => {
                  if (adminSnapshot.exists()) {
                    navigate("/tela_inicial_Adm"); // Administrador
                  } else {
                    setMessage("Usuário não encontrado no banco de dados.");
                  }
                })
                .catch((error) => {
                  console.error("Erro ao buscar administrador:", error);
                  setMessage("Erro ao buscar dados do administrador.");
                });
            }
          })
          .catch((error) => {
            console.error("Erro ao buscar usuário:", error);
            setMessage("Erro ao buscar dados do usuário.");
          });
      }
    }, [user, navigate]);
    

  function handleSignIn(e) {
    e.preventDefault();
    signInWithEmailAndPassword(email, password);
  }

  return (
    <div className="container">
      <header className="header">
        <img className="logo" src={logo} alt="CampoPlay" />
        <br />
        <span>Facilitando o seu lazer</span>
      </header>
      <form>
        <div className="inputContainer">
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="email@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="**********"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <a href="#">Esqueceu sua Senha?</a>

        <button className="botao" onClick={handleSignIn} disabled={loading}>
          {loading ? "Carregando..." : "Entrar"}
        </button>

        {message && <p style={{ color: "red" }}>{message}</p>}

        {error && <p style={{ color: "red" }}>Erro no login! Verifique seus dados.</p>}

        <div className="footer">
          <p>Não tem uma conta? </p>
          <Link to="/register">Faça sua conta</Link>

          <br />
          
        </div>
      </form>
    </div>
  );
}
