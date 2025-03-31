import { useState } from "react"; 
import { Link } from "react-router-dom"; 
import { auth, database } from "../../servicos/firebaseConfig";
import { ref, set } from "firebase/database";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import logo from "../../assets/logo.svg";

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [cpfMessage, setCpfMessage] = useState('');

  const [createUserWithEmailAndPassword, user, loading, error] = 
    useCreateUserWithEmailAndPassword(auth);

  function handleSignUp(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    if (cpfMessage !== "CPF válido!") {
      alert("CPF inválido! Corrija antes de continuar.");
      return;
    }

    createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const userId = userCredential.user.uid;
        salvarCPF(userId, cpf); // Chama a função para salvar CPF no banco
      })
      .catch((error) => {
        console.error("Erro ao registrar:", error);
      });
  }

  function salvarCPF(userId, cpf) {
    set(ref(database, `usuarios/${userId}`), {
      cpf: cpf
    })
      .then(() => {
        alert("Usuário cadastrado e CPF salvo com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao salvar CPF:", error);
      });
  }

  function formatarCPF(value) {
    let cpf = value.replace(/\D/g, ""); // Remove tudo que não for número
    cpf = cpf.replace(/^(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    cpf = cpf.replace(/\.(\d{3})(\d)/, ".$1-$2");
    return cpf;
  }

  function validarCPF(value) {
    let cpf = value.replace(/\D/g, ""); // Remove não numéricos
  
    if (cpf.length !== 11) {
      setCpfMessage("CPF inválido!");
      return false;
    }
  
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf[i - 1]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) {
      setCpfMessage("CPF inválido!");
      return false;
    }
  
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf[i - 1]) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) {
      setCpfMessage("CPF inválido!");
      return false;
    }
  
    setCpfMessage("CPF válido!");
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

        <label htmlFor="cpf">Digite seu CPF:</label>
        <input
          type="text"
          id="cpf"
          maxLength="14"
          value={cpf}
          onChange={(e) => {
            const cpfFormatado = formatarCPF(e.target.value);
            setCpf(cpfFormatado);
            validarCPF(cpfFormatado);
          }}
        />
        <br />
        <span style={{ color: cpfMessage === "CPF válido!" ? "green" : "red" }}>
          {cpfMessage}
        </span>

        <p>As Credenciais estão certas?</p>

        <button onClick={handleSignUp} className="botao">
          Cadastrar
        </button>

        <div className="footer">
          <p>Já tem uma conta? </p>
          <Link to="/">Acesse sua conta</Link>
        </div>
        <div className="footer">
          <p>Tem um campo e deseja registrar ele em nosso site</p>
          <Link to="/register_ADM">Clique aqui</Link>
        </div>
      </form>
    </div>
  );
}
