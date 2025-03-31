import { useState } from "react"; 
import { Link } from "react-router-dom"; 
import { auth, database } from "../../servicos/firebaseConfig";
import { ref, set } from "firebase/database";
import './style.css';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import logo from "../../assets/logo.svg";

export function ADM() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cnpjMessage, setCnpjMessage] = useState('');

  const [createUserWithEmailAndPassword, user, loading, error] = 
    useCreateUserWithEmailAndPassword(auth);

  function handleSignUp(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    if (cnpjMessage !== "CNPJ válido!") {
      alert("CNPJ inválido! Corrija antes de continuar.");
      return;
    }

    createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const userId = userCredential.user.uid;
        salvarCNPJ(userId, cnpj); // Chama a função para salvar CNPJ no banco
      })
      .catch((error) => {
        console.error("Erro ao registrar:", error);
      });
  }

  function salvarCNPJ(userId, cnpj) {
    set(ref(database, `administradores/${userId}/documento`), {
      cnpj: cnpj
    })
    .then(() => {
      alert("Usuário cadastrado e CNPJ salvo com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao salvar CNPJ:", error);
    });
  }

  function formatarCNPJ(value) {
    let cnpj = value.replace(/\D/g, ""); // Remove tudo que não for número
    cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
    cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");

    return cnpj;
  }

  function validarCNPJ(value) {
    let cnpj = value.replace(/\D/g, ""); // Remove não numéricos

    if (cnpj.length !== 14) {
      setCnpjMessage("CNPJ inválido!");
      return false;
    }

    if (/^(\d)\1+$/.test(cnpj)) {
      setCnpjMessage("CNPJ inválido!");
      return false;
    }

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) {
      setCnpjMessage("CNPJ inválido!");
      return false;
    }

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) {
      setCnpjMessage("CNPJ inválido!");
      return false;
    }

    setCnpjMessage("CNPJ válido!");
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
        </div>
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
            id="cnpj"
            maxLength="18"
            value={cnpj}
            onChange={(e) => {
              const formattedCnpj = formatarCNPJ(e.target.value);
              setCnpj(formattedCnpj);
              validarCNPJ(formattedCnpj);
            }}
          />
          <span style={{ color: cnpjMessage === "CNPJ válido!" ? "green" : "red" }}>
            {cnpjMessage}
          </span>
        </div>
        
        <p>As Credenciais estão certas?</p>

        <button onClick={handleSignUp} className="botao">
          Cadastrar
        </button>

        <div className="footer">
          <p>Já tem uma conta? </p>
          <Link to="/">Acesse sua conta</Link>
        </div>
        <div className="footer">
          <p>É Apenas um Cliente?</p>
          <Link to="/register">Clique aqui</Link>
        </div>
      </form>
    </div>
  );
}
