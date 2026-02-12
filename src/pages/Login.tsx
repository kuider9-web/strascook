import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const success = await login(email, password);

			if (success) {
				// Connexion réussie → Redirige vers le back-office
				navigate("/admin");
			} else {
				// Identifiants incorrects
				setError("Email ou mot de passe incorrect");
			}
		} catch (err) {
			setError("Une erreur est survenue lors de la connexion");
			console.error("Erreur de connexion:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="login-page">
			<div className="login-container">
				<div className="login-card">
					<div className="login-header">
						<h1>Strascook</h1>
						<p className="login-subtitle">Espace Administrateur & Chef</p>
					</div>

					<form onSubmit={handleSubmit} className="login-form">
						<div className="form-group">
							<label htmlFor="email">Email</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="admin@strascook.fr"
								required
								autoComplete="email"
								disabled={isLoading}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="password">Mot de passe</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								required
								autoComplete="current-password"
								disabled={isLoading}
							/>
						</div>

						{error && (
							<div className="error-message" role="alert">
								⚠️ {error}
							</div>
						)}

						<button type="submit" className="login-button" disabled={isLoading}>
							{isLoading ? "Connexion en cours..." : "Se connecter"}
						</button>
					</form>

					<div className="demo-credentials">
						<p className="demo-title">
							<strong> Comptes de démonstration</strong>
						</p>
						<div className="demo-accounts">
							<div className="demo-account">
								<p className="demo-role">Chef Cuisinier</p>
								<p> chef@strascook.fr</p>
								<p> chef123</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
