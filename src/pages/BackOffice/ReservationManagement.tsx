import { useEffect, useState } from "react";
import type { Reservation } from "../../services/dataSync";
import DataSyncService from "../../services/dataSync";
import "./ReservationManagement.css";

function ReservationManagement() {
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [filterStatus, setFilterStatus] = useState<
		"all" | Reservation["status"]
	>("all");

	useEffect(() => {
		loadReservations();

		// Écoute les changements depuis l'espace client
		const handleUpdate = () => {
			loadReservations();
		};

		window.addEventListener("reservationsUpdated", handleUpdate);

		return () => {
			window.removeEventListener("reservationsUpdated", handleUpdate);
		};
	}, []);

	const loadReservations = () => {
		const allReservations = DataSyncService.getReservations();
		setReservations(allReservations);
	};

	const handleStatusChange = (id: string, status: Reservation["status"]) => {
		DataSyncService.updateReservationStatus(id, status);
		loadReservations();
	};

	const handleDelete = (id: string) => {
		if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
			DataSyncService.deleteReservation(id);
			loadReservations();
		}
	};

	const filteredReservations =
		filterStatus === "all"
			? reservations
			: reservations.filter((r) => r.status === filterStatus);

	const getStatusColor = (status: Reservation["status"]) => {
		switch (status) {
			case "pending":
				return "#f39c12";
			case "confirmed":
				return "#27ae60";
			case "cancelled":
				return "#c0392b";
			default:
				return "#95a5a6";
		}
	};

	const getStatusLabel = (status: Reservation["status"]) => {
		switch (status) {
			case "pending":
				return "En attente";
			case "confirmed":
				return "Confirmée";
			case "cancelled":
				return "Annulée";
		}
	};

	return (
		<div className="reservation-management">
			<h1>Gestion des Réservations</h1>

			<div className="filters">
				<button
					type="button"
					onClick={() => setFilterStatus("all")}
					className={filterStatus === "all" ? "active" : ""}
				>
					Toutes ({reservations.length})
				</button>
				<button
					type="button"
					onClick={() => setFilterStatus("pending")}
					className={filterStatus === "pending" ? "active" : ""}
				>
					En attente (
					{reservations.filter((r) => r.status === "pending").length})
				</button>
				<button
					type="button"
					onClick={() => setFilterStatus("confirmed")}
					className={filterStatus === "confirmed" ? "active" : ""}
				>
					Confirmées (
					{reservations.filter((r) => r.status === "confirmed").length})
				</button>
				<button
					type="button"
					onClick={() => setFilterStatus("cancelled")}
					className={filterStatus === "cancelled" ? "active" : ""}
				>
					Annulées (
					{reservations.filter((r) => r.status === "cancelled").length})
				</button>
			</div>

			{filteredReservations.length === 0 ? (
				<p className="no-reservations">Aucune réservation trouvée.</p>
			) : (
				<div className="reservations-list">
					{filteredReservations.map((reservation) => (
						<div key={reservation.id} className="reservation-card">
							<div className="reservation-header">
								<h3>{reservation.clientName}</h3>
								<span
									className="status-badge"
									style={{
										backgroundColor: getStatusColor(reservation.status),
									}}
								>
									{getStatusLabel(reservation.status)}
								</span>
							</div>

							<div className="reservation-details">
								<p>
									<strong>Date :</strong> {reservation.date} à{" "}
									{reservation.time}
								</p>
								<p>
									<strong>Convives :</strong> {reservation.guests}
								</p>
								<p>
									<strong>Email :</strong> {reservation.clientEmail}
								</p>
								<p>
									<strong>Téléphone :</strong> {reservation.clientPhone}
								</p>
								<p>
									<strong>Total :</strong> {reservation.totalPrice.toFixed(2)}€
								</p>

								{reservation.notes && (
									<p>
										<strong>Notes :</strong> {reservation.notes}
									</p>
								)}

								{reservation.menus.length > 0 && (
									<div className="reservation-menus">
										<strong>Menus sélectionnés :</strong>
										<ul>
											{reservation.menus.map((menu) => (
												<li key={menu.nom}>
													{menu.nom} x{menu.quantiter}
												</li>
											))}
										</ul>
									</div>
								)}
							</div>

							<div className="reservation-actions">
								{reservation.status === "pending" && (
									<>
										<button
											type="button"
											onClick={() =>
												handleStatusChange(reservation.id, "confirmed")
											}
											className="btn-confirm"
										>
											✓ Confirmer
										</button>
										<button
											type="button"
											onClick={() =>
												handleStatusChange(reservation.id, "cancelled")
											}
											className="btn-cancel"
										>
											✕ Annuler
										</button>
									</>
								)}
								<button
									type="button"
									onClick={() => handleDelete(reservation.id)}
									className="btn-delete"
								>
									🗑️ Supprimer
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default ReservationManagement;
