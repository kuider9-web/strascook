import { useEffect, useState } from "react";
import type { Reservation } from "../../utils/localStorage";
import {
	getReservations,
	updateReservationStatus,
} from "../../utils/localStorage";
import "./ReservationManagement.css";

function ReservationManagement() {
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		setReservations(getReservations());
	}, []);

	const showSuccess = (message: string) => {
		setSuccessMessage(message);
		setTimeout(() => setSuccessMessage(""), 3000);
	};

	const handleAccept = (id: number) => {
		updateReservationStatus(id, "accepted");
		setReservations(getReservations());
		showSuccess("✅ Réservation acceptée !");
	};

	const handleRefuse = (id: number) => {
		if (window.confirm("Refuser cette réservation ?")) {
			updateReservationStatus(id, "refused");
			setReservations(getReservations());
			showSuccess("❌ Réservation refusée");
		}
	};

	const getStatusBadge = (status: string) => {
		const badges = {
			pending: { label: "En attente", color: "orange" },
			accepted: { label: "Acceptée", color: "green" },
			refused: { label: "Refusée", color: "red" },
		};
		return badges[status as keyof typeof badges];
	};

	return (
		<div className="reservation-management">
			<h2>📅 Gestion des Réservations</h2>

			{successMessage && (
				<div className="success-message">{successMessage}</div>
			)}

			{reservations.length === 0 ? (
				<p className="no-data">Aucune réservation pour le moment.</p>
			) : (
				<div className="reservation-table">
					{reservations.map((reservation) => {
						const badge = getStatusBadge(reservation.status);
						return (
							<div key={reservation.id} className="reservation-row">
								<div className="reservation-info">
									<span className={`status-badge ${badge.color}`}>
										{badge.label}
									</span>
									<h3>{reservation.clientName}</h3>
									<p>
										📅 {reservation.date} à {reservation.time}
									</p>
									<p>
										👥 {reservation.guests} personne
										{reservation.guests > 1 ? "s" : ""}
									</p>
								</div>

								{reservation.status === "pending" && (
									<div className="reservation-actions">
										<button
											type="button"
											className="btn-accept"
											onClick={() => handleAccept(reservation.id)}
										>
											✅ Accepter
										</button>
										<button
											type="button"
											className="btn-refuse"
											onClick={() => handleRefuse(reservation.id)}
										>
											❌ Refuser
										</button>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default ReservationManagement;
