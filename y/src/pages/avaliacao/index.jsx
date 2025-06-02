import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TelaAv.css";
import { ref, runTransaction, get } from "firebase/database";
import { database } from "../../servicos/firebaseConfig";

export default function AvaliacaoCampo() {
  const { campoId } = useParams();

  const [ultimaNota, setUltimaNota] = useState(null);

  const [mediaFirebase, setMediaFirebase] = useState(null);
  const [totalAvaliacoesFirebase, setTotalAvaliacoesFirebase] = useState(null);

  const navigate = useNavigate();

  // Buscar média, total e contagem global
  const buscarDadosFirebase = async () => {
    if (!campoId) return;
    const avaliacaoRef = ref(database, `campos/${campoId}/avaliacao`);
    try {
      const snapshot = await get(avaliacaoRef);
      if (snapshot.exists()) {
        const dados = snapshot.val();
        setMediaFirebase(dados.media);
        setTotalAvaliacoesFirebase(dados.total_avaliacoes);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do Firebase:", error);
    }
  };

  useEffect(() => {
    buscarDadosFirebase();
  }, [campoId]);

  const salvarAvaliacaoFirebase = async (notaParaSalvar) => {
    if (!campoId) {
      alert("Erro: Identificador do campo não encontrado para salvar a avaliação.");
      return;
    }

    const avaliacaoRef = ref(database, `campos/${campoId}/avaliacao`);

    try {
      await runTransaction(avaliacaoRef, (currentData) => {
        if (currentData === null) {
          return {
            media: parseFloat(notaParaSalvar.toFixed(2)),
            total_avaliacoes: 1,
            contagem: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, [String(notaParaSalvar)]: 1 },
          };
        } else {
          const novaContagem = { ...(currentData.contagem || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }) };
          novaContagem[String(notaParaSalvar)] = (novaContagem[String(notaParaSalvar)] || 0) + 1;

          const novoTotalAvaliacoes = (currentData.total_avaliacoes || 0) + 1;

          let somaDasNotas = 0;
          for (const nKey in novaContagem) {
            somaDasNotas += parseInt(nKey) * novaContagem[nKey];
          }

          const novaMedia = novoTotalAvaliacoes > 0 ? (somaDasNotas / novoTotalAvaliacoes) : 0;

          return {
            media: parseFloat(novaMedia.toFixed(2)),
            total_avaliacoes: novoTotalAvaliacoes,
            contagem: novaContagem,
          };
        }
      }).then((result) => {
        const dadosAtualizados = result.snapshot.val();
        if (dadosAtualizados) {
          setMediaFirebase(dadosAtualizados.media);
          setTotalAvaliacoesFirebase(dadosAtualizados.total_avaliacoes);
        }
      });
    } catch (error) {
      console.error("Erro ao salvar avaliação no Firebase:", error);
      alert("Erro ao enviar avaliação.");
    }
  };

  const enviarAvaliacao = (nota) => {
    setUltimaNota(nota);

    salvarAvaliacaoFirebase(nota);

    setTimeout(() => {
      navigate("/tela_inicial");
    }, 10000);
  };

  return (
    <div className="container">
      <div className="card-avaliacao">
        <div className="header">
          <h2>Avalie nosso campo de futebol</h2>
          {campoId && <p className="campo-id-text">Você está avaliando {campoId}</p>}
        </div>

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
          <div className="resultado-avaliacao">
            <p>
              Obrigado! Você avaliou com nota <strong>{ultimaNota}</strong>.
            </p>

            {mediaFirebase !== null && totalAvaliacoesFirebase !== null && (
              <p>
                Média total das avaliações:{" "}
                <strong>{mediaFirebase}</strong> ({totalAvaliacoesFirebase} avaliação
                {totalAvaliacoesFirebase !== 1 ? "s" : ""})
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
