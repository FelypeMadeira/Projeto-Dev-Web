import './tela.css';
import '../../assets/cifrao.png'
import {Link , useNavigate} from "react-router-dom";
export function TelaInicial(){
    return (
        <div>
    
          {/* Cabeçalho */}
          <header>
            <div className="container">
              <h1>Arena Futebol</h1>
              <nav>
                <ul>
                  <li><a href="#">Home</a></li>
                  <li><a href="#">Reservas</a></li>
                  <li><a href="#">Preços</a></li>
                  <li><a href="#">Galeria</a></li>
                  <li><a href="#">Contato</a></li>
                </ul>
              </nav>
            </div>
          </header>
    
          
          <section className="hero">
            <div className="hero-content">
              <h2>Reserve seu campo e marque aquele jogo com os amigos!</h2>
              <a href="#" className="btn">Fazer Reserva</a>
            </div>
          </section>
    
          
          <section className="destaques">
            <div className="container">
              <div className="itens-destaque">
                <img src="icone-campo.png" alt="Campo Iluminado" />
                <h3>Campos Iluminados</h3>
                <p>Jogue de dia ou à noite com excelente iluminação!</p>
              </div>
              <div className="itens-destaque">
                <img src="" alt="Agendamento Fácil" />
                <h3>Facilidade de Agendamento</h3>
                <p>Reserve seu horário em poucos cliques.</p>
              </div>
              <div className="itens-destaque">
                <img src="cifrao.png" alt="Preço Acessível" />
                <h3>Preços Acessíveis</h3>
                <p>Planos para todos os tipos de partidas.</p>
              </div>
            </div>
          </section>
    
        
          <footer>
            <div className="container">
              <p>&copy; 2025 Arena Futebol - Todos os direitos reservados.</p>
              <div className="social">
                <a href="#">Instagram</a> | <a href="#">Facebook</a> | <a href="#">WhatsApp</a>
              </div>
            </div>
          </footer>

          <Link to="/avaliacao">avalie o campo</Link>
    
        </div>
      );
}