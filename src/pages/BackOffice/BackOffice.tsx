import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CalendarAvailability from "./CalendarAvailability";
import MenuManagement from "./MenuManagement";
import ReservationManagement from "./ReservationManagement";
import "./BackOffice.css";

type Tab = "menus" | "reservations" | "calendar";

function BackOffice() {
	const [activeTab, setActiveTab] = useState<Tab>("reservations");
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<div className="back-office">
			<header className="bo-header">
				<h1>🍽️ Tableau de bord - {user?.name}</h1>
				<div className="header-info">
					<span className="user-role">
						{user?.role === "admin" ? "Administrateur" : "Chef"}
					</span>
					<button type="button" onClick={handleLogout} className="logout-btn">
						Déconnexion
					</button>
				</div>
			</header>

			<nav className="bo-nav">
				<button
					type="button"
					className={activeTab === "reservations" ? "active" : ""}
					onClick={() => setActiveTab("reservations")}
				>
					📅 Réservations
				</button>
				<button
					type="button"
					className={activeTab === "menus" ? "active" : ""}
					onClick={() => setActiveTab("menus")}
				>
					🍽️ Mes Menus
				</button>
				<button
					type="button"
					className={activeTab === "calendar" ? "active" : ""}
					onClick={() => setActiveTab("calendar")}
				>
					📆 Disponibilités
				</button>
			</nav>

			<main className="bo-content">
				{activeTab === "reservations" && <ReservationManagement />}
				{activeTab === "menus" && <MenuManagement />}
				{activeTab === "calendar" && <CalendarAvailability />}
			</main>
		</div>
	);
}

export default BackOffice;
