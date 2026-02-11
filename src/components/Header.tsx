import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import panierIcone from "../asset/image/panierIcon.png";
import { useAuth } from "../context/AuthContext";
import { usePanier } from "../context/PanierContext";
import "./Header.css";

function Header() {
	const { totalArticles, panier, supprimerDuPanier, total } = usePanier();
	const [afficherPanier, setAfficherPanier] = useState(false);
	const { user, isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();

	function goReservation() {
		setAfficherPanier(false);
		navigate("/reservation");
	}
	function handleLogout() {
		logout();
		navigate("/");
	}

	return (
		<header className="header">
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
				{isAuthenticated && (
					<Link to="/admin" className="admin-link">
						Back-Office
					</Link>
				)}
				{isAuthenticated ? (
					<div className="user-menu">
						<span className="user-name">👤 {user?.name}</span>
						<button type="button" className="logout-btn" onClick={handleLogout}>
							Déconnexion
						</button>
					</div>
				) : (
					<Link to="/login" className="login-link">
						Connexion
					</Link>
				)}

				<div className="panier-icon-container">
					<button
						type="button"
						className="panier-btn"
						onClick={() => setAfficherPanier(!afficherPanier)}
						aria-label="Ouvrir le panier"
					>
						<img src={panierIcone} alt="Panier" />
					</button>
					{totalArticles > 0 && (
						<span className="panier-badge">{totalArticles}</span>
					)}
				</div>
			</nav>

			{afficherPanier && (
				<div>
					<button
						type="button"
						className="panier-overlay"
						onClick={() => setAfficherPanier(false)}
						aria-label="Fermer le panier"
					/>
					<div className="panier-modal">
						<div className="panier-modal-header">
							<h2>Mon Panier ({totalArticles})</h2>
							<button
								type="button"
								className="panier-close"
								onClick={() => setAfficherPanier(false)}
								aria-label="Fermer"
							>
								✕
							</button>
						</div>
						{panier.length === 0 ? (
							<p className="panier-empty">Votre panier est vide 🍽️</p>
						) : (
							<ul className="panier-list">
								{panier.map((item) => (
									<li key={item.nom} className="panier-item">
										<img src={item.image_URL} alt={item.nom} />
										<div className="panier-item-info">
											<p className="panier-item-nom">{item.nom}</p>
											<p className="panier-item-prix">
												x{item.quantiter} — {item.prix}
											</p>
										</div>
										<button
											type="button"
											className="panier-item-delete"
											onClick={() => supprimerDuPanier(item.nom)}
											aria-label={`Supprimer ${item.nom}`}
										>
											✕
										</button>
									</li>
								))}
							</ul>
						)}
						<div className="panier-total">
							<span className="panier-total-label">Total</span>
							<span className="panier-total-prix">{total.toFixed(2)}€</span>
						</div>
						{panier.length > 0 && (
							<button
								type="button"
								onClick={goReservation}
								className="panier-reserver-btn"
							>
								Réserver
							</button>
						)}
					</div>
				</div>
			)}

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
