import { useEffect, useState } from "react";
import DataSyncService from "../../services/dataSync";
import "./CalendarAvailability.css";

function CalendarAvailability() {
	const [blockedDates, setBlockedDates] = useState<string[]>([]);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		loadDates();

		const handleUpdate = () => {
			loadDates();
		};

		window.addEventListener("reservationsUpdated", handleUpdate);
		window.addEventListener("datesUpdated", handleUpdate);

		return () => {
			window.removeEventListener("reservationsUpdated", handleUpdate);
			window.removeEventListener("datesUpdated", handleUpdate);
		};
	}, []);

	const loadDates = () => {
		const unavailable = DataSyncService.getUnavailableDates();
		setBlockedDates(unavailable);
	};

	const showSuccess = (message: string) => {
		setSuccessMessage(message);
		setTimeout(() => setSuccessMessage(""), 3000);
	};

	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		return { daysInMonth, startingDayOfWeek, year, month };
	};

	const formatDate = (year: number, month: number, day: number) => {
		return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
	};

	const getDayStatus = (dateStr: string) => {
		const hasAM = blockedDates.includes(`${dateStr}-AM`);
		const hasPM = blockedDates.includes(`${dateStr}-PM`);
		const fullDay = blockedDates.includes(dateStr);

		if (fullDay || (hasAM && hasPM)) {
			return { status: "full", icon: "🔒", label: "Journée complète" };
		}
		if (hasAM) {
			return { status: "am", icon: "🌅", label: "Matinée réservée" };
		}
		if (hasPM) {
			return { status: "pm", icon: "🌆", label: "Après-midi réservée" };
		}
		return { status: "available", icon: "✅", label: "Disponible" };
	};

	const handleDateClick = (dateStr: string) => {
		const reservations = DataSyncService.getReservations();

		// Vérifie si AM ou PM sont réservés
		const hasAM = reservations.some(
			(r) =>
				r.date === dateStr &&
				r.status === "confirmed" &&
				parseInt(r.time.split(":")[0], 10) < 14,
		);
		const hasPM = reservations.some(
			(r) =>
				r.date === dateStr &&
				r.status === "confirmed" &&
				parseInt(r.time.split(":")[0], 10) >= 14,
		);

		if (hasAM && hasPM) {
			alert(
				"⚠️ Cette journée est complètement réservée (matin ET après-midi). Vous ne pouvez pas la modifier.",
			);
			return;
		}

		if (hasAM || hasPM) {
			const period = hasAM ? "matinée" : "après-midi";
			alert(
				`⚠️ La ${period} de cette date a une réservation confirmée.\n\nPour bloquer toute la journée, vous devez d'abord annuler la réservation.`,
			);
			return;
		}

		// Bloque/débloque la journée entière
		const updated = DataSyncService.toggleBlockedDate(dateStr);
		setBlockedDates(DataSyncService.getUnavailableDates());

		if (updated.includes(dateStr)) {
			showSuccess("🔒 Journée bloquée");
		} else {
			showSuccess("✅ Journée débloquée");
		}
	};

	const changeMonth = (offset: number) => {
		setCurrentMonth(
			new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset),
		);
	};

	const { daysInMonth, startingDayOfWeek, year, month } =
		getDaysInMonth(currentMonth);

	const monthNames = [
		"Janvier",
		"Février",
		"Mars",
		"Avril",
		"Mai",
		"Juin",
		"Juillet",
		"Août",
		"Septembre",
		"Octobre",
		"Novembre",
		"Décembre",
	];

	const days = [];
	for (let i = 0; i < startingDayOfWeek; i++) {
		days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
	}

	for (let day = 1; day <= daysInMonth; day++) {
		const dateStr = formatDate(year, month, day);
		const dayStatus = getDayStatus(dateStr);
		const isPast =
			new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));

		days.push(
			<button
				key={day}
				type="button"
				className={`calendar-day ${dayStatus.status} ${isPast ? "past" : ""}`}
				onClick={() => !isPast && handleDateClick(dateStr)}
				disabled={isPast}
				title={dayStatus.label}
			>
				<span className="day-number">{day}</span>
				<span className="day-status">{dayStatus.icon}</span>
			</button>,
		);
	}

	return (
		<div className="calendar-availability">
			<h2> Mes Disponibilités</h2>

			{successMessage && (
				<div className="success-message">{successMessage}</div>
			)}

			<div className="calendar-header">
				<button type="button" onClick={() => changeMonth(-1)}>
					◀ Mois précédent
				</button>
				<h3>
					{monthNames[month]} {year}
				</h3>
				<button type="button" onClick={() => changeMonth(1)}>
					Mois suivant ▶
				</button>
			</div>

			<div className="calendar-legend">
				<span>
					<span className="legend-icon available">✅</span> Disponible
				</span>
				<span>
					<span className="legend-icon am">🌅</span> Matinée réservée
				</span>
				<span>
					<span className="legend-icon pm">🌆</span> Après-midi réservée
				</span>
				<span>
					<span className="legend-icon full">🔒</span> Journée complète
				</span>
			</div>

			<div className="calendar-grid">
				<div className="weekday">Dim</div>
				<div className="weekday">Lun</div>
				<div className="weekday">Mar</div>
				<div className="weekday">Mer</div>
				<div className="weekday">Jeu</div>
				<div className="weekday">Ven</div>
				<div className="weekday">Sam</div>
				{days}
			</div>

			<p className="calendar-info">
				Cliquez sur une date pour bloquer/débloquer la journée entière. Les
				créneaux (matinée/après-midi) avec réservations confirmées sont
				protégés.
			</p>
		</div>
	);
}

export default CalendarAvailability;
