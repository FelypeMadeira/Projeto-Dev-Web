import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './tela_adm.css'
// Importar as funções do Firebase necessárias
import { database, ref, get, onValue } from '../../servicos/firebaseConfig.js';

export function Adm() {
    const navigate = useNavigate();
    const [reservasExistentes, setReservasExistentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [campos, setCampos] = useState([]); // Adicionado estado para campos, necessário para buscar informações do campo na reserva
    const [usuarios, setUsuarios] = useState([]); // Adicionado estado para usuários, necessário para buscar informações do usuário na reserva

    // Função para buscar os dados iniciais dos campos e usuários, e depois escutar as reservas em tempo real
    const fetchData = async () => {
        setLoading(true); // Inicia o estado de carregamento
        try {
            // Busca inicial dos campos (necessário para popular campoInfo nas reservas)
            const camposRef = ref(database, 'campos');
            const camposSnapshot = await get(camposRef);
            let camposArray = [];
            if (camposSnapshot.exists()) {
                const camposData = camposSnapshot.val();
                camposArray = Object.keys(camposData).map(key => ({
                    id: key,
                    ...camposData[key]
                }));
                setCampos(camposArray);
            } else {
                setCampos([]);
            }

            // Busca inicial dos usuários (necessário para popular usuarioInfo nas reservas)
            const usuariosRef = ref(database, 'usuarios');
            const usuariosSnapshot = await get(usuariosRef);
            let usuariosArray = [];
            if (usuariosSnapshot.exists()) {
                const usuariosData = usuariosSnapshot.val();
                usuariosArray = Object.keys(usuariosData)
                    .filter(key => usuariosData[key].nome_cliente)
                    .map(key => ({
                        id: key,
                        nome_cliente: usuariosData[key].nome_cliente,
                        email: usuariosData[key].email || 'N/A'
                    }));
                setUsuarios(usuariosArray);
            } else {
                setUsuarios([]);
            }

            // Escuta as reservas em tempo real
            const reservasRef = ref(database, 'usuarios');
            onValue(reservasRef, (snapshot) => {
                const allUsersData = snapshot.val();
                const loadedReservas = [];
                if (allUsersData) {
                    Object.keys(allUsersData).forEach(userId => {
                        if (allUsersData[userId].reservas) {
                            Object.keys(allUsersData[userId].reservas).forEach(reservaId => {
                                const reservaData = allUsersData[userId].reservas[reservaId];

                                // Encontra as informações do campo e do usuário com base nos arrays já carregados
                                const campoInfo = camposArray.find(c => c.id === reservaData.campo.id) || reservaData.campo;
                                const usuarioInfo = usuariosArray.find(u => u.id === userId) || { nome_cliente: reservaData.nome_usuario || 'Usuário Desconhecido' };

                                loadedReservas.push({
                                    id: reservaId,
                                    ...reservaData,
                                    campo: campoInfo,
                                    usuario_id: userId,
                                    nome_usuario: usuarioInfo.nome_cliente,
                                });
                            });
                        }
                    });
                }
                setReservasExistentes(loadedReservas); // Atualiza o estado das reservas
            }, (error) => {
                console.error("Erro ao carregar reservas em tempo real:", error);
                // Em caso de erro, você pode querer buscar uma vez ou exibir uma mensagem
            });

        } catch (error) {
            console.error("Erro ao buscar dados do Firebase:", error);
            alert("Erro ao carregar dados. Por favor, tente novamente.");
        } finally {
            setLoading(false); // Finaliza o estado de carregamento
        }
    };

    // useEffect para chamar fetchData uma única vez ao montar o componente
    useEffect(() => {
        fetchData();
    }, []); // A dependência vazia ([]) garante que fetchData é chamada apenas uma vez

    // Lógica para sair da página (redireciona para a tela de login)
    const handleLogout = () => {
        navigate('/'); // Redireciona para a rota de login
    };

    if (loading) {
        return <div className="adm-container">Carregando dados...</div>;
    }

    return (
        <div className="adm-container"> {/* Adicione uma classe CSS para o container */}
            <h1>Painel do Administrador</h1>
            
            <button onClick={() => navigate("../pagina_RCampo")}>
                Cadastrar Campo
            </button>
            
            <button onClick={() => navigate("/reserva")}>
                Gerenciar Reservas (Criar Nova)
            </button>

            {/* Início da funcionalidade da tabela de reservas existentes integrada */}
            <section className="reservas-existentes">
                <h2>Reservas Existentes</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Campo</th>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Categoria</th>
                            <th>Admin Responsável</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Mapeia o array de reservas para criar uma linha de tabela para cada reserva */}
                        {reservasExistentes.map((reserva) => (
                            <tr key={reserva.id}>
                                {/* Renderiza as informações da reserva. Adiciona verificação de null/undefined para 'campo' */}
                                <td>{reserva.campo?.nome || 'N/A'}</td>
                                <td>{reserva.data}</td>
                                <td>{reserva.hora}</td>
                                <td>{reserva.nome_usuario || 'Desconhecido'}</td> {/* Adicionado fallback para nome de usuário */}
                                <td>{reserva.categoria}</td>
                                <td>{reserva.administrador_responsavel_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Exibe uma mensagem se não houver reservas encontradas */}
                {reservasExistentes.length === 0 && <p>Nenhuma reserva encontrada.</p>}
            </section>
            {/* Fim da funcionalidade da tabela de reservas existentes integrada */}

            
            <button className="logout-button" onClick={handleLogout}>
                Sair
            </button>
        </div>
    );
}
