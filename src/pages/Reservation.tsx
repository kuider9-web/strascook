import { useState } from "react";
import "./Reservation.css";
import { usePanier } from "../context/PanierContext";
import DataSyncService from "../services/dataSync";

function Reservation() {
	const { panier, total, totalArticles, viderPanier } = usePanier();
	const [confirmationMessage, setConfirmationMessage] = useState("");

	const [formData, setFormData] = useState({
		nom: "",
		prenom: "",
		email: "",
		telephone: "",
		particulierOuProfessionnel: "particulier",
		typeEvenement: "mariage",
		avecDecoration: "non",
		dateEvenement: "",
		heureEvenement: "19:00",
		nombreConvives: 2,
		message: "",
	});

	// Récupère les créneaux indisponibles
	const unavailableDates = DataSyncService.getUnavailableDates();

	// Vérifie la disponibilité du créneau sélectionné
	const getSlotAvailability = () => {
		if (!formData.dateEvenement || !formData.heureEvenement)
			return { available: true, message: "" };

		const hour = parseInt(formData.heureEvenement.split(":")[0], 10);
		const period = hour < 14 ? "AM" : "PM";
		const dateWithPeriod = `${formData.dateEvenement}-${period}`;

		// Vérifie si la journée entière est bloquée
		if (unavailableDates.includes(formData.dateEvenement)) {
			return {
				available: false,
				message: "❌ Cette journée est entièrement bloquée",
			};
		}

		// Vérifie si le créneau spécifique est réservé
		if (unavailableDates.includes(dateWithPeriod)) {
			return {
				available: false,
				message: `❌ Le créneau ${period === "AM" ? "matinée" : "après-midi"} n'est pas disponible`,
			};
		}

		return {
			available: true,
			message: `✅ Créneau ${period === "AM" ? "matinée" : "après-midi"} disponible`,
		};
	};

	const slotStatus = getSlotAvailability();

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		// Vérifie la disponibilité avant de soumettre
		if (!slotStatus.available) {
			alert(
				"❌ Ce créneau n'est pas disponible. Veuillez choisir une autre date ou un autre horaire.",
			);
			return;
		}

		const reservation = DataSyncService.addReservation({
			clientName: `${formData.prenom} ${formData.nom}`,
			clientEmail: formData.email,
			clientPhone: formData.telephone,
			date: formData.dateEvenement,
			time: formData.heureEvenement,
			guests: formData.nombreConvives,
			menus: panier.map((item) => ({
				id: item.nom,
				nom: item.nom,
				prix: parseFloat(item.prix),
				description: "",
				image_URL: item.image_URL,
				quantiter: item.quantiter,
			})),
			totalPrice: total,
			notes: `Type: ${formData.typeEvenement}, ${formData.particulierOuProfessionnel}, Décoration: ${formData.avecDecoration}. ${formData.message}`,
		});

		const hour = parseInt(formData.heureEvenement.split(":")[0], 10);
		const period = hour < 14 ? "matinée" : "après-midi";

		setConfirmationMessage(
			`✅ Réservation confirmée !\n\nNuméro : ${reservation.id}\nDate : ${formData.dateEvenement}\nCréneau : ${period}\nHeure : ${formData.heureEvenement}\n\nNous vous recontacterons sous 24h.`,
		);

		viderPanier();

		setFormData({
			nom: "",
			prenom: "",
			email: "",
			telephone: "",
			particulierOuProfessionnel: "particulier",
			typeEvenement: "mariage",
			avecDecoration: "non",
			dateEvenement: "",
			heureEvenement: "19:00",
			nombreConvives: 2,
			message: "",
		});

		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	return (
		<div className="page-reservation">
			{confirmationMessage && (
				<div className="confirmation-message">{confirmationMessage}</div>
			)}

			<div className="intro">
				<h2>Demande de réservation</h2>
				<p>
					Besoin de précisions, d'un devis ou d'un premier échange ? Laissez un
					message via ce formulaire ou contactez directement le chef. Chaque
					demande est traitée avec soin et réactivité. Nous vous accompagnerons
					en vous donnant une réponse par mail sous 24h.
				</p>
				<p>
					Tel: 06.58.60.39.19
					<br />
					Email: gastronomique@gmail.com
				</p>
			</div>

			{panier.length > 0 && (
				<div className="panier-recap">
					<h3>
						Votre sélection ({totalArticles}{" "}
						{totalArticles > 1 ? "articles" : "article"})
					</h3>
					<ul>
						{panier.map((item) => (
							<li key={item.nom} className="panier-recap-item">
								<img src={item.image_URL} alt={item.nom} />
								<span className="panier-recap-nom">{item.nom}</span>
								<span className="panier-recap-quantite">x{item.quantiter}</span>
								<span className="panier-recap-prix">
									{(parseFloat(item.prix) * item.quantiter).toFixed(2)}€
								</span>
							</li>
						))}
					</ul>
					<div className="panier-recap-total">
						<span>Total</span>
						<span>{total.toFixed(2)}€</span>
					</div>
				</div>
			)}

			<form onSubmit={handleSubmit}>
				<div className="ligne">
					<label>
						Nom *
						<input
							type="text"
							value={formData.nom}
							onChange={(e) =>
								setFormData({ ...formData, nom: e.target.value })
							}
							required
						/>
					</label>
					<label>
						Prénom *
						<input
							type="text"
							value={formData.prenom}
							onChange={(e) =>
								setFormData({ ...formData, prenom: e.target.value })
							}
							required
						/>
					</label>
				</div>
				<label>
					Email *
					<input
						type="email"
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
						required
					/>
				</label>
				<label>
					Téléphone *
					<input
						type="tel"
						value={formData.telephone}
						onChange={(e) =>
							setFormData({ ...formData, telephone: e.target.value })
						}
						required
					/>
				</label>
				<label>
					Particulier ou professionnel
					<select
						value={formData.particulierOuProfessionnel}
						onChange={(e) =>
							setFormData({
								...formData,
								particulierOuProfessionnel: e.target.value,
							})
						}
					>
						<option value="particulier">Particulier</option>
						<option value="professionnel">Professionnel</option>
					</select>
				</label>
				<label>
					Type d'événement
					<select
						value={formData.typeEvenement}
						onChange={(e) =>
							setFormData({ ...formData, typeEvenement: e.target.value })
						}
					>
						<option value="mariage">Mariage</option>
						<option value="anniversaire">Anniversaire</option>
						<option value="corporate">Corporate</option>
						<option value="autre">Autre</option>
					</select>
				</label>
				<label>
					Avec décoration
					<select
						value={formData.avecDecoration}
						onChange={(e) =>
							setFormData({ ...formData, avecDecoration: e.target.value })
						}
					>
						<option value="oui">Oui</option>
						<option value="non">Non</option>
					</select>
				</label>
				<label>
					Date de l'événement *
					<input
						type="date"
						value={formData.dateEvenement}
						onChange={(e) =>
							setFormData({ ...formData, dateEvenement: e.target.value })
						}
						min={new Date().toISOString().split("T")[0]}
						required
					/>
					{unavailableDates.includes(formData.dateEvenement) && (
						<span
							style={{
								color: "red",
								fontSize: "0.9rem",
								marginTop: "0.5rem",
								display: "block",
							}}
						>
							⚠️ Cette journée est entièrement bloquée
						</span>
					)}
				</label>
				<label>
					Heure de l'événement *
					<input
						type="time"
						value={formData.heureEvenement}
						onChange={(e) =>
							setFormData({ ...formData, heureEvenement: e.target.value })
						}
						required
					/>
					{formData.heureEvenement && formData.dateEvenement && (
						<span
							style={{
								color: slotStatus.available ? "#27ae60" : "#c0392b",
								fontSize: "0.9rem",
								marginTop: "0.5rem",
								display: "block",
								fontWeight: "600",
							}}
						>
							{slotStatus.message}
						</span>
					)}
				</label>
				<label>
					Nombre de convives *
					<input
						type="number"
						value={formData.nombreConvives}
						onChange={(e) =>
							setFormData({
								...formData,
								nombreConvives: parseInt(e.target.value, 10) || 2,
							})
						}
						min="1"
						max="500"
						required
					/>
				</label>
				<label>
					Message
					<textarea
						value={formData.message}
						onChange={(e) =>
							setFormData({ ...formData, message: e.target.value })
						}
					/>
				</label>
				<button type="submit">Envoyer la réservation</button>
			</form>
		</div>
	);
}

export default Reservation;
