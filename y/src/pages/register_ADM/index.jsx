import { useState } from "react"; 
import { Link } from "react-router-dom"; 
import { auth } from "../../servicos/firebaseConfig";
import './style.css'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import logo from "../../assets/logo.svg";

export function ADM() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [createUserWithEmailAndPassword, user, loading, error] = 
    useCreateUserWithEmailAndPassword(auth);

  function handleSignUp(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    createUserWithEmailAndPassword(email, password);
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  


  return (
    <div className="container">
      <header className="header">
        <img className="logo" src={logo} alt="CampoPlay" />
        <br />
        <span>Digite suas informações de Cadastro</span>
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
           <div className="inputContainer">
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="**********"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="inputContainer">
          <label>CNPJ</label>
          <input 
          type="text"
          name="cnpj"
          id="cnpj"
          placeholder="CNPJ"
          

          />

        </div>
        

 <br />

        </div>
        <p>As Credênciais estão certas?</p>

        <button onClick={handleSignUp} className="botao">
          Cadastrar
        </button>

        <div className="footer">
          <p>Já tem uma conta? </p>
          <Link to="/">Acesse sua conta</Link>
        </div>
        <div className="footer">
          <p>É Apenas um Cliente ?</p>
          
          <Link to="/register" >Clique aqui</Link>

        </div>
      </form>
    </div>
  );
}
