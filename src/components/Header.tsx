import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
	return (
		<header className="header">
			<nav className="header-nav">
				<Link to="/">Home</Link>
				<Link to="/menu">Menu</Link>
				<Link to="/galerie">Galerie</Link>
				<Link to="/reservation">Réservation</Link>
			</nav>
			<video className="header-video" autoPlay loop muted playsInline>
				<source src="/video_header.mp4" type="video/mp4" />
				Votre navigateur ne supporte pas la vidéo.
			</video>
			<div className="header-overlay"></div>

			<nav className="header-nav">
				<Link to="/">Accueil</Link>
				<Link to="/menu">Les Menus</Link>
				<Link to="/galerie">Galerie</Link>
				<Link to="/reservation">Réservations</Link>
			</nav>

			<div className="header-content">
				<h1 className="header-title">Gastronomique</h1>
				<p className="header-subtitle">
					Une cuisine d'auteur, local et moyante.
				</p>
				<div className="header-actions">
					<Link to="/reservation" className="btn-primary">
						Réserver dès maintenant
					</Link>
					<Link to="/menu" className="btn-secondary">
						Ou découvrez les menus →
					</Link>
				</div>
			</div>
			<Link to="/">Home</Link>
			<Link to="/menu">Menu</Link>
			<Link to="/galerie">Galerie</Link>
			<Link to="/reservation">Réservation</Link>
		</header>
	);
}

export default Header;
