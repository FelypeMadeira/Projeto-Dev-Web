import './tela.css';
import { Link, useNavigate } from "react-router-dom"; // Importe useNavigate
import logoSvg from '../../assets/logo.svg'

export function TelaInicial() {
    const navigate = useNavigate(); // Inicialize o hook useNavigate

    const imagemCampoA = "/campoA.jpg";
    const imagemCampoB = "/campoB.jpg";
    const imagemCampoC = "/campoC.jpg";

    return (
        <div>
            <header>
                <div className="container">
                  
                    
                    <h1>Arena Futebol</h1>
                    <img src={logoSvg} alt="Arena Futebol Logo" className="header-logo" />
                    <nav>
                        <ul>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Reservas</a></li>
                            <li><a href="#">Preços</a></li>
                            <li><a href="#">Galeria</a></li>
                            <li><a href="#" onClick={() => navigate('/contato')}>Contato</a></li> {/* Adicionado onClick para navegar para a página de contato */}
                        </ul>
                    </nav>
                </div>
            </header>

            <section className="hero">
                <div className="hero-content">
                    <h2>Reserve seu campo e marque aquele jogo com os amigos!</h2>
                    <a href="#" className="btn" onClick={() => navigate('/contato')}>Fazer Reserva</a> {/* Adicionado onClick para navegar para a página de contato */}
                </div>
            </section>

            <section className="destaques">
                <div className="container">
                    {/* Campo A */}
                    <div className="itens-destaque">
                        <img
                            src={imagemCampoA}
                            alt="Imagem do Campo A"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/E0E0E0/B0B0B0?text=Imagem+Indisponível"; }}
                        />
                        <h3>Campo A</h3>
                        <p>Jogue de dia ou à noite com excelente iluminação!</p>
                        <button className="btn-reservar" onClick={() => navigate('/contato')}>
                            Fazer Reserva
                        </button>
                        <Link to="/avaliacao/campoA" className="btn-avaliacao">Avaliar Campo A</Link>
                    </div>

                    {/* Campo B */}
                    <div className="itens-destaque">
                        <img
                            src={imagemCampoB}
                            alt="Imagem do Campo B"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/E0E0E0/B0B0B0?text=Imagem+Indisponível"; }}
                        />
                        <h3>Campo B</h3>
                        <p>Reserve seu horário em poucos cliques.</p>
                        <button className="btn-reservar" onClick={() => navigate('/reserva')}>
                            Fazer Reserva
                        </button>
                        <Link to="/avaliacao/campoB" className="btn-avaliacao">Avaliar Campo B</Link>
                    </div>

                    {/* Campo C */}
                    <div className="itens-destaque">
                        <img
                            src={imagemCampoC}
                            alt="Imagem do Campo C"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/E0E0E0/B0B0B0?text=Imagem+Indisponível"; }}
                        />
                        <h3>Campo C</h3>
                        <p>Venha Jogar com A Gente!!</p>
                        <button className="btn-reservar" onClick={() => navigate('/reserva')}>
                            Fazer Reserva
                        </button>
                        {/* Link para avaliar o Campo C */}
                        <Link to="/avaliacao/campoC" className="btn-avaliacao">Avaliar Campo C</Link>
                    </div>
                </div>
            </section>

            <footer>
                <div className="container">
                    <p>&copy; 2025 Arena Futebol - Todos os direitos reservados.</p>
                    <div className="social">
                        Isso é apenas um trabalho de faculdade, feito para um trabalho necessário para a conclusão do Curso
                    </div>
                </div>
            </footer>
        </div>
    );
}
