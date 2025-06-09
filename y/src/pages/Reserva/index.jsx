

import { useState, useEffect } from 'react';
import './tela_reserva.css';
import { useNavigate } from 'react-router-dom';

// Importar as funções do Firebase
import { database, ref, get, push, set, onValue } from '../../servicos/firebaseConfig.js';


const Reserva = () => {
  const navigate = useNavigate();
  const [campos, setCampos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedCampo, setSelectedCampo] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [reservasExistentes, setReservasExistentes] = useState([]);
  const [loading, setLoading] = useState(true); 
  // Busca os dados
  const fetchData = async () => {
    setLoading(true);
    try {
      // Busca os campos
      const camposRef = ref(database, 'campos');
      const camposSnapshot = await get(camposRef);
      if (camposSnapshot.exists()) {
        const camposData = camposSnapshot.val();
        const camposArray = Object.keys(camposData).map(key => ({
          id: key,
          ...camposData[key]
        }));
        setCampos(camposArray);
      } else {
        setCampos([]);
      }

      // Busca nome dos Usuários
      const usuariosRef = ref(database, 'usuarios');
      const usuariosSnapshot = await get(usuariosRef);
      if (usuariosSnapshot.exists()) {
        const usuariosData = usuariosSnapshot.val();
        const usuariosArray = Object.keys(usuariosData)
          .filter(key => usuariosData[key].nome_cliente) // filtra pra só clientes
          .map(key => ({
            id: key,
            nome_cliente: usuariosData[key].nome_cliente,
            email: usuariosData[key].email || 'N/A' 
          }));
        setUsuarios(usuariosArray);
      } else {
        setUsuarios([]);
      }

      
      const reservasRef = ref(database, 'usuarios'); 
      onValue(reservasRef, (snapshot) => {
        const allUsersData = snapshot.val();
        const loadedReservas = [];
        if (allUsersData) {
          Object.keys(allUsersData).forEach(userId => {
            if (allUsersData[userId].reservas) {
              Object.keys(allUsersData[userId].reservas).forEach(reservaId => {
                const reservaData = allUsersData[userId].reservas[reservaId];
                
                const campoInfo = campos.find(c => c.id === reservaData.campo.id) || reservaData.campo; 
                const usuarioInfo = usuarios.find(u => u.id === userId) || { nome_cliente: reservaData.nome_usuario || 'Usuário Desconhecido' };

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
        setReservasExistentes(loadedReservas);
      }, (error) => {
        console.error("Erro ao carregar reservas em tempo real:", error);
        // Em caso de erro, você pode querer buscar uma vez ou exibir uma mensagem
        get(reservasRef).then((snap) => {
          // Lógica de fallback para buscar uma vez
        }).catch(err => console.error("Erro de fallback:", err));
      });

    } catch (error) {
      console.error("Erro ao buscar dados do Firebase:", error);
      alert("Erro ao carregar dados. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  fetchData();
}, []);
 // Re-executa se a lista de campos ou usuários mudar

  const handleReservar = async () => {
    if (!selectedCampo || !selectedDate || !selectedTime || !selectedUser || !selectedCategory) {
      alert('Por favor, preencha todos os campos da reserva.');
      return;
    }

    // Lógica para verificar disponibilidade do horário NO FRONT-END
    // Para uma verificação robusta, esta lógica deve ser feita no backend (Cloud Functions)
    const isTimeTaken = reservasExistentes.some(reserva =>
      reserva.campo.id === selectedCampo &&
      reserva.data === selectedDate &&
      reserva.hora === selectedTime
    );

    if (isTimeTaken) {
      alert('Este horário já está reservado para o campo selecionado. Por favor, escolha outro.');
      return;
    }

    try {
      const campoSelecionado = campos.find(c => c.id === selectedCampo);
      const usuarioSelecionado = usuarios.find(u => u.id === selectedUser);

      if (!campoSelecionado || !usuarioSelecionado) {
        alert("Campo ou usuário selecionado inválido.");
        return;
      }

      // Cria um objeto de reserva com os dados necessários
      // A estrutura da reserva deve espelhar o que você tem no banco de dados
      const newReservationData = {
        campo: {
          administrador_id: campoSelecionado.administrador_id,
          id: campoSelecionado.id,
          localizacao: campoSelecionado.localizacao,
          nome: campoSelecionado.nome,
          tipo: campoSelecionado.tipo
        },
        data: selectedDate,
        hora: selectedTime,
        categoria: selectedCategory,
        administrador_responsavel_id: 'VU98NaTzLNSAcNg8CyvauKo2SUK2', // Usar o ID do administrador logado
      };

      // Adicionar a reserva sob o usuário selecionado no Firebase
      // Caminho: /usuarios/{userId}/reservas/{newPushKey}
      const userReservationsRef = ref(database, `usuarios/${selectedUser}/reservas`);
      const newReservaRef = push(userReservationsRef); // Gera uma nova chave única
      await set(newReservaRef, newReservationData);

      alert('Reserva efetuada com sucesso!');

      // Limpar o formulário
      setSelectedCampo('');
      setSelectedDate('');
      setSelectedTime('');
      setSelectedUser('');
      setSelectedCategory('');
      // Não é necessário chamar setReservasExistentes aqui, pois o onValue já fará a atualização
    } catch (error) {
      console.error("Erro ao efetuar reserva:", error);
      alert("Erro ao efetuar reserva. Por favor, tente novamente.");
    }
  };

  if (loading) {
    return <div className="reserva-admin-container">Carregando dados...</div>;
  }

  return (
    <div className="reserva-admin-container">
      <h1>Gerenciamento de Reservas</h1>

      <section className="nova-reserva-form">
        <h2>Fazer Nova Reserva</h2>
        <div className="form-group">
          <label htmlFor="campo">Campo:</label>
          <select
            id="campo"
            value={selectedCampo}
            onChange={(e) => setSelectedCampo(e.target.value)}
          >
            <option value="">Selecione um campo</option>
            {campos.map((campo) => (
              <option key={campo.id} value={campo.id}>
                {campo.nome} ({campo.tipo})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="data">Data:</label>
          <input
            type="date"
            id="data"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="hora">Hora:</label>
          <input
            type="time"
            id="hora"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="usuario">Usuário (Cliente):</label>
          <select
            id="usuario"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Selecione um usuário</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nome_cliente} ({usuario.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="categoria">Categoria da Reserva:</label>
          <select
            id="categoria"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Selecione a categoria</option>
            <option value="Lazer">Lazer</option>
            <option value="Evento">Evento</option>
            <option value="Treino">Treino</option>
            <option value="Torneio">Torneio</option>
            
          </select>
        </div>

        <button onClick={handleReservar}>Efetuar Reserva</button>
      </section>

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
              {/* Adicione outras colunas se necessário (e.g., ações como editar/cancelar) */}
            </tr>
          </thead>
          <tbody>
            {reservasExistentes.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.campo?.nome || 'N/A'}</td> {/* Adicionado verificação de null/undefined */}
                <td>{reserva.data}</td>
                <td>{reserva.hora}</td>
                <td>{reserva.nome_usuario || 'Desconhecido'}</td> {/* Adicionado fallback */}
                <td>{reserva.categoria}</td>
                <td>{reserva.administrador_responsavel_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {reservasExistentes.length === 0 && <p>Nenhuma reserva encontrada.</p>}
      </section>

  
      <button onClick={() => navigate('/tela_inicial_Adm')}>Voltar para Tela Inicial ADM</button>
    </div>
  );
};
export default Reserva;
