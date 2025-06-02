import './tela.css';
import { Link, useNavigate } from "react-router-dom";

export function TelaInicial() {
    
    const imagemCampoA = "/campoA.jpg"; 
    const imagemCampoB = "/campoB.jpg"; 
    const imagemCampoC = "/campoC.jpg"; 


    return (
        <div>
            
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
                           
                            <li><Link to="/registrar-campo">Registar Campo</Link></li>
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
                        <img 
                            src={imagemCampoA} 
                            alt="Imagem do Campo A" 
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200/E0E0E0/B0B0B0?text=Imagem+Indisponível"; }}
                        />
                        <h3>Campo A</h3>
                        <p>Jogue de dia ou à noite com excelente iluminação!</p>
                      
                        <Link to="/avaliacao/campoA" className="btn-avaliacao">Avaliar Campo A</Link>
                    </div>

                    
                    <div className="itens-destaque">
                        <img 
                            src={imagemCampoB} 
                            alt="Imagem do Campo B" 
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200/E0E0E0/B0B0B0?text=Imagem+Indisponível"; }}
                        />
                        <h3>Campo B</h3>
                        <p>Reserve seu horário em poucos cliques.</p>
                        
                        <Link to="/avaliacao/campoB" className="btn-avaliacao">Avaliar Campo B</Link>
                    </div>

                    
                    <div className="itens-destaque">
                        <img 
                            src={imagemCampoC} 
                            alt="Imagem do Campo C" 
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200/E0E0E0/B0B0B0?text=Imagem+Indisponível"; }}
                        />
                        <h3>Campo C</h3>
                        <p>Venha Jogar com A Gente!!</p>
                        {/* Link para avaliar o Campo C */}
                        <Link to="/avaliacao/campoC" className="btn-avaliacao">Avaliar Campo C</Link>
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

            
        </div>
    );
}

