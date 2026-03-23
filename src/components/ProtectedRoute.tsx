import type { ReactNode } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
	children: ReactNode;
	requiredRole?: "admin" | "chef";
}

export function ProtectedRoute({
	children,
	requiredRole,
}: ProtectedRouteProps) {
	const { isAuthenticated, user, isLoading } = useAuth();

	// Pendant le chargement (vérification du localStorage)
	if (isLoading) {
		return (
			<div className="loading-screen">
				<div className="loading-spinner"></div>
				<p>Vérification de l'authentification...</p>
			</div>
		);
	}

	// Si pas authentifié → Redirige vers /login
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	// Si un rôle spécifique est requis et que l'utilisateur ne l'a pas
	if (requiredRole && user?.role !== requiredRole) {
		return (
			<div className="unauthorized">
				<div className="unauthorized-icon">⛔</div>
				<h2>Accès refusé</h2>
				<p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
				<p className="unauthorized-roles">
					Rôle requis : <strong>{requiredRole}</strong> — Votre rôle : <strong>{user?.role}</strong>
				</p>
				<Link to="/" className="unauthorized-home-btn">← Retour à l'accueil</Link>
			</div>
		);
	}

	// Tout est OK → Affiche le composant protégé
	return <>{children}</>;
}
