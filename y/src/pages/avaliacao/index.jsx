import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TelaAv.css";

export default function AvaliacaoCampo() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [ultimaNota, setUltimaNota] = useState(null);
  const [contagemNotas, setContagemNotas] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  const navigate = useNavigate(); // hook do React Router

  const enviarAvaliacao = (nota) => {
    setAvaliacoes((prev) => [...prev, nota]);
    setUltimaNota(nota);

    setContagemNotas((prev) => ({
      ...prev,
      [nota]: prev[nota] + 1,
    }));

    // Redireciona para a página inicial após 1 segundo (opcional)
    setTimeout(() => {
      navigate("/tela_inicial");
    }, 1000); // tempo para exibir a mensagem de "Obrigado", opcional
  };

  const calcularMedia = () => {
    if (avaliacoes.length === 0) return 0;
    const total = avaliacoes.reduce((acc, nota) => acc + nota, 0);
    return (total / avaliacoes.length).toFixed(2);
  };

  return (
    <div className="avaliacao-container">
      <h2>Avalie nosso campo de futebol</h2>

      <div className="botoes-avaliacao">
        {[1, 2, 3, 4, 5].map((nota) => (
          <button
            key={nota}
            onClick={() => enviarAvaliacao(nota)}
            className="botao-nota"
          >
            {nota}
          </button>
        ))}
      </div>

      {ultimaNota && (
        <div className="resultado-avaliacao mt-4">
          <p>
            Obrigado! Você avaliou com nota <strong>{ultimaNota}</strong>.
          </p>
          <p>
            Média das avaliações:{" "}
            <strong>{calcularMedia()}</strong> ({avaliacoes.length} avaliação
            {avaliacoes.length !== 1 ? "s" : ""})
          </p>

          <h4>Contagem de votos:</h4>
          <ul>
            {[1, 2, 3, 4, 5].map((nota) => (
              <li key={nota}>
                Nota {nota}: {contagemNotas[nota]} voto
                {contagemNotas[nota] !== 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
