import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, database } from "../../servicos/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";

export function RegistroEndereco() {
    const [endereco, setEndereco] = useState("");
    const [complemento, setComplemento] = useState("");
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    function handleSaveAdress(e) {
        e.preventDefault();
        
        if (!user) {
            alert("Você precisa estar logado para registrar um endereço!");
            return;
        }

        if (!endereco.trim()) {
            alert("O campo de endereço não pode estar vazio!");
            return;
        }

        const userId = user.uid;

        set(ref(database, `enderecos/${userId}`), {
            endereco: endereco,
            complemento: complemento
        })
        .then(() => {
            alert("Endereço salvo com sucesso!");
            navigate("../tela_inicial");
        })
        .catch((error) => {
            console.error("Erro ao salvar o endereço: ", error);
        });
    }

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="container">
            <h2>Registrar Endereço do Campo</h2>
            <form onSubmit={handleSaveAdress}>
                <div className="inputContainer">
                    <label htmlFor="endereco">Endereço:</label>
                    <input
                        type="text"
                        id="endereco"
                        placeholder="Exemplo: Quadra 10, conjunto Z, 03"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                    />
                </div>

                <div className="inputContainer">
                    <label htmlFor="complemento">Complemento:</label>
                    <input
                        type="text"
                        id="complemento"
                        placeholder="Complemento"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                    />
                </div>

                <button type="submit">Salvar Endereço</button>
            </form>
        </div>
    );
}
