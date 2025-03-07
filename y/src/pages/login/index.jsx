import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo.svg";
import { auth } from "../../servicos/firebaseConfig";
import "./styles.css";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

export function Login() {
  // Estados para email e senha
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hook para autenticação com Firebase
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  function handleSignIn(e) {
    e.preventDefault();
    signInWithEmailAndPassword(email, password);
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (user) {
    console.log(user);
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

        <button className="botao" onClick={handleSignIn}>
          Entrar
        </button>

        <div className="footer">
          <p>Não tem uma conta? </p>
          <Link to="/register">Faça sua conta</Link>
        </div>
      </form>
    </div>
  );
}
