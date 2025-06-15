import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database, ref, get } from '../../servicos/firebaseConfig';
import './contato.css'


const ContatoAdmin = () => {
  const navigate = useNavigate();
  const [adminPhone, setAdminPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ADMIN_ID = 'VU98NaTzLNSAcNg8CyvauKo2SUK2'; 

  useEffect(() => {
    const fetchAdminPhone = async () => {
      try {
        // Referência ao nó do administrador específico.
        // CORREÇÃO: Removemos '/documento' do caminho, pois 'telefone'
        // está diretamente sob o ID do administrador no seu JSON.
        const adminRef = ref(database, `administradores/${ADMIN_ID}`);
        const snapshot = await get(adminRef);

        if (snapshot.exists()) {
          const adminData = snapshot.val();
          // Verifica se a propriedade 'telefone' existe nos dados do administrador.
          if (adminData.telefone) {
            setAdminPhone(adminData.telefone);
          } else {
            // Se 'telefone' não for encontrado, exibe uma mensagem de erro.
            setError("Número de telefone do administrador não encontrado nos dados.");
          }
        } else {
          // Se os dados do administrador não forem encontrados, exibe uma mensagem de erro.
          setError("Dados de contato do administrador não encontrados.");
        }
      } catch (err) {
        console.error("Erro ao buscar telefone do administrador:", err);
        setError("Não foi possível carregar o telefone do administrador. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminPhone();
  }, []);

  const handleGoBack = () => {
    // Mantido 'tela_inicial' como a rota de retorno para o usuário,
    // conforme sua última alteração.
    navigate('/tela_inicial');
  };

  if (loading) {
    return (
      <div className="contato-admin-container">
        <p>Carregando informações de contato...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contato-admin-container">
        <p className="error-message">{error}</p>
        <button onClick={handleGoBack} className="voltar-adm-button">
          Voltar à Tela Inicial
        </button>
      </div>
    );
  }

  return (
    <div className="contato-admin-container">
      <h1>Entre em Contato para Reservas</h1>
      {adminPhone ? (
        <div className="contact-info">
          <p>Para reservar um campo, entre em contato com o administrador:</p>
          <p className="phone-number">
            <a href={`tel:${adminPhone.replace(/\D/g, '')}`}>{adminPhone}</a>
          </p>
        </div>
      ) : (
        <p>As informações de contato do administrador não estão disponíveis no momento.</p>
      )}

      <button onClick={handleGoBack} className="voltar-adm-button">
        Voltar à Tela Inicial
      </button>
    </div>
  );
};

export default ContatoAdmin;
