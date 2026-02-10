import { useState } from "react";
import CalendarAvailability from "./CalendarAvailability";
import MenuManagement from "./MenuManagement";
import ReservationManagement from "./ReservationManagement";
import "./BackOffice.css";

type Tab = "menus" | "reservations" | "calendar";

function BackOffice() {
	const [activeTab, setActiveTab] = useState<Tab>("menus");

	return (
		<div className="back-office">
			<header className="bo-header">
				<h1> Tableau de bord - Chef</h1>
			</header>

			<nav className="bo-nav">
				<button
					type="button"
					className={activeTab === "menus" ? "active" : ""}
					onClick={() => setActiveTab("menus")}
				>
					Mes Menus
				</button>
				<button
					type="button"
					className={activeTab === "reservations" ? "active" : ""}
					onClick={() => setActiveTab("reservations")}
				>
					Réservations
				</button>
				<button
					type="button"
					className={activeTab === "calendar" ? "active" : ""}
					onClick={() => setActiveTab("calendar")}
				>
					Disponibilités
				</button>
			</nav>

			<main className="bo-content">
				{activeTab === "menus" && <MenuManagement />}
				{activeTab === "reservations" && <ReservationManagement />}
				{activeTab === "calendar" && <CalendarAvailability />}
			</main>
		</div>
	);
}

export default BackOffice;
