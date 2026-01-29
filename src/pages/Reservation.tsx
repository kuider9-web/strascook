import { useState } from "react";
import { InlineWidget } from "react-calendly";
import "./Reservation.css";

function Reservation() {
	const [formData, setFormData] = useState({
		nom: "",
		prenom: "",
		email: "",
		telephone: "",
		particulierOuProfessionnel: "particulier",
		typeEvenement: "mariage",
		avecDecoration: "non",
		dateEvenement: "",
		message: "",
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		console.log(formData);
	}

	return (
		<div className="page-reservation">
			<div className="haut">
				<div className="intro">
					<h2>Demande de réservation:</h2>
					<p>
						Besoin de précisions, d’un devis ou d’un premier échange ? Laissez
						un message via ce formulaire ou contactez directement le chef :
						chaque demande est traitée avec soin et réactivité. Vous pouvez
						également voir nos disponibilitées via notre calendrier. Nous vous
						accompagnerons en vous donnant une réponse par mail sous 24h.
					</p>
					<p>
						Tel: 06.58.60.39.19
						<br />
						Email: gastronomique@gmail.com
					</p>
				</div>
				<div className="calendrier">
					<InlineWidget
						url="https://calendly.com/ragolk/30min"
						styles={{ height: "650px", width: "100%" }}
					/>
				</div>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="ligne">
					<label>
						Nom{" "}
						<input
							type="text"
							value={formData.nom}
							onChange={(e) =>
								setFormData({ ...formData, nom: e.target.value })
							}
						/>
					</label>
					<label>
						Prénom{" "}
						<input
							type="text"
							value={formData.prenom}
							onChange={(e) =>
								setFormData({ ...formData, prenom: e.target.value })
							}
						/>
					</label>
				</div>
				<label>
					Email{" "}
					<input
						type="email"
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
					/>
				</label>
				<label>
					Téléphone{" "}
					<input
						type="tel"
						value={formData.telephone}
						onChange={(e) =>
							setFormData({ ...formData, telephone: e.target.value })
						}
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
					Date de l'événement{" "}
					<input
						type="date"
						value={formData.dateEvenement}
						onChange={(e) =>
							setFormData({ ...formData, dateEvenement: e.target.value })
						}
					/>
				</label>
				<label>
					Message{" "}
					<textarea
						value={formData.message}
						onChange={(e) =>
							setFormData({ ...formData, message: e.target.value })
						}
					/>
				</label>
				<button type="submit">Envoyer</button>
			</form>
		</div>
	);
}

export default Reservation;
