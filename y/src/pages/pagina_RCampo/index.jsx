import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, database } from "../../servicos/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { ref, set, get } from "firebase/database";

export function RegistroNovoCampo() {
    // Estado para a chave principal do nó do campo (ex: "campoA", "meuCampoFavorito")
    const [chaveNoCampo, setChaveNoCampo] = useState(""); 
    
    // Estado para detalhes do campo
    const [nomeCampo, setNomeCampo] = useState("");
    const [tipoCampo, setTipoCampo] = useState("");

    // Estado para detalhes da localização
    const [endereco, setEndereco] = useState("");
    const [complemento, setComplemento] = useState("");

    const [user, loadingAuth] = useAuthState(auth);
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    async function handleSaveFieldData(e) {
        e.preventDefault();
        
        if (!user) {
            alert("Você precisa estar autenticado para registar um campo!");
            return;
        }

        if (!chaveNoCampo.trim()) {
            alert("A 'Chave de Identificação do Campo no Banco de Dados' não pode estar vazia! (Ex: campoA, campoPrincipal)");
            return;
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(chaveNoCampo.trim())) {
            alert("A 'Chave de Identificação do Campo no Banco de Dados' deve conter apenas letras, números, underscores (_) ou hífens (-). Sem espaços ou caracteres especiais.");
            return;
        }
        if (!nomeCampo.trim()) {
            alert("O nome do campo não pode estar vazio!");
            return;
        }
        if (!tipoCampo.trim()) {
            alert("O tipo do campo não pode estar vazio!");
            return;
        }
        if (!endereco.trim()) {
            alert("O campo de endereço não pode estar vazio!");
            return;
        }

        setIsSaving(true);
        const userId = user.uid;
        const localizacaoString = complemento ? `${endereco}, ${complemento}` : endereco;
        const chavePrincipalFormatada = chaveNoCampo.trim();

        try {
            // Verificar se já existe um campo com esta chave principal
            const campoExistenteRef = ref(database, `campos/${chavePrincipalFormatada}`);
            const snapshotExistente = await get(campoExistenteRef);
            if (snapshotExistente.exists()) {
                alert(`Já existe um campo registado com a chave de identificação "${chavePrincipalFormatada}". Por favor, escolha outra.`);
                setIsSaving(false);
                return;
            }

            // Determinar o próximo campoId numérico interno
            const todosCamposRef = ref(database, 'campos');
            const snapshotTodosCampos = await get(todosCamposRef);
            let nextNumericId = 1;
            if (snapshotTodosCampos.exists()) {
                let maxId = 0;
                snapshotTodosCampos.forEach(childSnapshot => {
                    const campoData = childSnapshot.val();
                    if (campoData && typeof campoData.campoId === 'number') {
                        maxId = Math.max(maxId, campoData.campoId);
                    }
                });
                nextNumericId = maxId + 1;
            }

            const fieldData = {
                campoId: nextNumericId, // ID numérico interno
                administrador_id: userId,
                nome: nomeCampo,
                tipo: tipoCampo,
                localizacao: localizacaoString,
                avaliacao: { 
                    media: 0,
                    total_avaliacoes: 0,
                    contagem: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
                }
            };

            // Salvar os dados do novo campo usando a chave principal informada
            await set(ref(database, `campos/${chavePrincipalFormatada}`), fieldData);

            alert(`Campo "${nomeCampo}" salvo com sucesso com a chave "${chavePrincipalFormatada}"!`);
            navigate("../tela_inicial");

        } catch (error) {
            console.error("Erro ao guardar o campo: ", error);
            alert("Erro ao guardar o campo. Verifique a consola para mais detalhes.");
        } finally {
            setIsSaving(false);
        }
    }

    if (loadingAuth) return <p>A carregar autenticação...</p>;
    if (isSaving) return <p>A guardar dados do campo...</p>

    return (
        <div className="container">
            <div className="card-form"> 
                <div className="header">
                    <h2>Registar Novo Campo</h2>
                </div>
                <form onSubmit={handleSaveFieldData}>
                    <div className="inputContainer">
                        <label htmlFor="chaveNoCampo">Chave de Identificação do Campo (Ex: campoA, campoPrincipal):</label>
                        <input
                            type="text"
                            id="chaveNoCampo"
                            placeholder="campoA (sem espaços ou caracteres especiais)"
                            value={chaveNoCampo}
                            onChange={(e) => setChaveNoCampo(e.target.value)}
                        />
                    </div>

                    <div className="inputContainer">
                        <label htmlFor="nomeCampo">Nome do Campo:</label>
                        <input
                            type="text"
                            id="nomeCampo"
                            placeholder="Ex: Campo Principal do Clube"
                            value={nomeCampo}
                            onChange={(e) => setNomeCampo(e.target.value)}
                        />
                    </div>

                    <div className="inputContainer">
                        <label htmlFor="tipoCampo">Tipo do Campo:</label>
                        <input
                            type="text"
                            id="tipoCampo"
                            placeholder="Ex: Futebol Society, Futsal, Ténis"
                            value={tipoCampo}
                            onChange={(e) => setTipoCampo(e.target.value)}
                        />
                    </div>
                    
                    <div className="inputContainer">
                        <label htmlFor="endereco">Endereço (Localização do Campo):</label>
                        <input
                            type="text"
                            id="endereco"
                            placeholder="Ex: Quadra 10, Conjunto Z, Lote 03"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                        />
                    </div>

                    <div className="inputContainer">
                        <label htmlFor="complemento">Complemento (Localização):</label>
                        <input
                            type="text"
                            id="complemento"
                            placeholder="Ex: Próximo ao Ginásio Central"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="botao" disabled={isSaving}>
                        {isSaving ? "A guardar..." : "Guardar Campo"}
                    </button>
                </form>
            </div>
        </div>
    );
}