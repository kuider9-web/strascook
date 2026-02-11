import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../asset/image/logo1.png";

function Header() {
	// Fonction pour remonter en haut de la page
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<header className="header">
			<video className="header-video" autoPlay loop muted playsInline>
				<source src="/video_header.mp4" type="video/mp4" />
				Votre navigateur ne supporte pas la vidéo.
			</video>
			<div className="header-overlay"></div>

			{/* Navbar sticky */}
			<nav className="header-nav">
				{/* Logo cliquable qui remonte */}
				<button onClick={scrollToTop} className="header-logo" type="button">
					<img src={logo} alt="Gastronomique Logo" />
				</button>

				{/* Navigation au centre */}
				<div className="header-nav-links">
					<Link to="/">Accueil</Link>
					<Link to="/menu">Les Menus</Link>
					<Link to="/galerie">Galerie</Link>
					<Link to="/reservation">Réservations</Link>
				</div>
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
		</header>
	);
}

export default Header;
