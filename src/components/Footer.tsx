import { Link } from "react-router-dom";
import "./Footer.css";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import logo from "../asset/image/logo1.png";

function Footer() {
	// Fonction pour remonter en haut de la page
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<footer className="footer">
			<div className="footer-top">
				<div className="footer-content">
					<div className="footer-section footer-info">
						<button
							onClick={scrollToTop}
							className="footer-logo-button"
							type="button"
						>
							<img
								src={logo}
								alt="Gastronomique Logo"
								className="footer-logo"
							/>
						</button>
						<h3>Gastronomique</h3>
						<div className="footer-contact">
							<p>Téléphone: 06.58.60.39.19</p>
							<p>Email: gastronomique@gmail.com</p>
						</div>
						<div className="footer-social">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
							>
								<FaInstagram />
							</a>
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook"
							>
								<FaFacebookF />
							</a>
							<a
								href="https://tiktok.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="TikTok"
							>
								<FaTiktok />
							</a>
						</div>
					</div>

					<div className="footer-section footer-nav">
						<div className="footer-column">
							<Link to="/">Accueil</Link>
							<Link to="/menu">Les Menus</Link>
							<Link to="/galerie">Galeries</Link>
							<Link to="/reservation">Réservations</Link>
						</div>
					</div>

					<div className="footer-section footer-legal">
						<Link to="/legal/siret">SIRET</Link>
						<Link to="/legal/cgv">Conditions générales de vente</Link>
						<Link to="/legal/mentions">Mentions Légales</Link>
					</div>
				</div>
			</div>

			<div className="footer-bottom">
				<p>© 2026 Gastronomique Tous droits réservés</p>
			</div>
		</footer>
	);
}

export default Footer;
