import { Link } from "react-router-dom";
import "./Footer.css";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";

function Footer() {
	return (
		<footer className="footer">
			<div className="footer-top">
				<div className="footer-content">
					<div className="footer-section footer-info">
						<h3>Gastronomique</h3>
						<div className="footer-contact">
							<p>Téléphone: 06.58.60.39.19</p>
							<p>Email: gastronomique@gmail.com</p>
						</div>
						<div className="footer-social">
							<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
								<FaInstagram />
							</a>
							<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
								<FaFacebookF />
							</a>
							<a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
								<FaTiktok />
							</a>
						</div>
					</div>

					<div className="footer-section footer-nav">
						<div className="footer-column">
							<Link to="/">Accueil</Link>
							<Link to="/menu">Les Menues</Link>
							<Link to="/galerie">Galeries</Link>
							<Link to="/reservation">Réservations</Link>
						</div>
					</div>

					<div className="footer-section footer-legal">
						<a href="/siret">Siret: 125646454645</a>
						<a href="/cgv">Conditions générales de vente</a>
						<a href="/mentions-legales">Mentions Légales</a>
					</div>
				</div>
			</div>

			<div className="footer-bottom">
				<p>© 2026 Gastronomique  Tous doits réservés</p>
			</div>
		</footer>
	);
}

export default Footer;