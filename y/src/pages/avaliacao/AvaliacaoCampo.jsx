import { useState } from "react";

export default function AvaliacaoCampo() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [ultimaNota, setUltimaNota] = useState(null);

  const enviarAvaliacao = (nota) => {
    setAvaliacoes([...avaliacoes, nota]);
    setUltimaNota(nota);
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
          <p>Obrigado! Você avaliou com nota <strong>{ultimaNota}</strong>.</p>
          <p>Média das avaliações: <strong>{calcularMedia()}</strong> ({avaliacoes.length} avaliações)</p>
        </div>
      )}
    </div>
  );
}
