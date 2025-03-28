import { useState } from "react"; 
import { Link } from "react-router-dom"; 
import { auth } from "../../servicos/firebaseConfig";
import './styles.css'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import logo from "../../assets/logo.svg";

export function Register() {
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

  function formatarCPF(campo) {
    let cpf = campo.value.replace(/\D/g, ""); 
    cpf = cpf.replace(/^(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    cpf = cpf.replace(/\.(\d{3})(\d)/, ".$1-$2");
    campo.value = cpf;
    
}

function validarCPF() {
    let cpf = document.getElementById("cpf").value.replace(/\D/g, ""); 
    let resultado = document.getElementById("resultado");

    if (cpf.length !== 11) {
        resultado.textContent = "CPF inválido!";
        resultado.style.color = "red";
        return false;
    }

   
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf[i - 1]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) {
        resultado.textContent = "CPF inválido!";
        resultado.style.color = "red";
        return false;
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf[i - 1]) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) {
        resultado.textContent = "CPF inválido!";
        resultado.style.color = "red";
        return false;
    }

    resultado.textContent = "CPF válido!";
    resultado.style.color = "green";
    return true;
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

        <label for="cpf">Digite seu CPF:</label>
        <input type="text" id="cpf" maxlength="14" onInput="formatarCPF()" onKeyUp="validarCPF()"/>
        <span id="resultado"></span>
        



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
          <p>Tem um campo e deseja registrar ele em nosso site</p>
          
          <Link to="/register_ADM" >Clique aqui</Link>

        </div>
      </form>
    </div>
  );
}
