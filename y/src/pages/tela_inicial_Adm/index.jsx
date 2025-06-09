
import { useNavigate } from "react-router-dom";

export function Adm() { 
    const navigate = useNavigate();

    return (
        <div>
            <h1>Painel do Administrador</h1>
            
            <button onClick={() => navigate("../pagina_RCampo")}>
                Cadastrar Endereço
            </button>

            
            <button onClick={() => navigate("/reserva")}>
                Gerenciar Reservas
            </button>
        </div>
    );
}