import { useEffect, useState } from "react";
import { getBlockedDates, toggleBlockedDate } from "../../utils/localStorage";
import "./CalendarAvailability.css";

function CalendarAvailability() {
	const [blockedDates, setBlockedDates] = useState<string[]>([]);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		setBlockedDates(getBlockedDates());
	}, []);

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

	const handleDateClick = (dateStr: string) => {
		const updated = toggleBlockedDate(dateStr);
		setBlockedDates(updated);

		if (updated.includes(dateStr)) {
			showSuccess("🔒 Date bloquée");
		} else {
			showSuccess("✅ Date débloquée");
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
		days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
	}

	for (let day = 1; day <= daysInMonth; day++) {
		const dateStr = formatDate(year, month, day);
		const isBlocked = blockedDates.includes(dateStr);
		const isPast =
			new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));

		days.push(
			<button
				key={day}
				type="button"
				className={`calendar-day ${isBlocked ? "blocked" : "available"} ${isPast ? "past" : ""}`}
				onClick={() => !isPast && handleDateClick(dateStr)}
				disabled={isPast}
			>
				<span className="day-number">{day}</span>
				<span className="day-status">{isBlocked ? "🔒" : "✅"}</span>
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
					<span className="legend-icon blocked">🔒</span> Bloqué
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
				Cliquez sur une date pour la bloquer ou la débloquer
			</p>
		</div>
	);
}

export default CalendarAvailability;
