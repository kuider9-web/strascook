import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
	return (
		<div className="not-found">
			<div className="not-found-content">
				<span className="not-found-code">404</span>
				<h1>Page introuvable</h1>
				<p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
				<div className="not-found-actions">
					<Link to="/" className="not-found-btn-primary">Retour à l'accueil</Link>
					<Link to="/reservation" className="not-found-btn-secondary">Faire une réservation</Link>
				</div>
			</div>
		</div>
	);
}

export default NotFound;
