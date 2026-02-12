import { useEffect, useState } from "react";
import type { MenuFilters, Plat } from "../../services/dataSync";
import DataSyncService from "../../services/dataSync";
import "./MenuManagement.css";

type Tab = "filters" | "custom";

function MenuManagement() {
	const [activeTab, setActiveTab] = useState<Tab>("filters");

	// Filtres
	const [filters, setFilters] = useState<MenuFilters>({
		vegetarien: true,
		vegetalien: true,
		sans_gluten: true,
		sans_lactose: true,
		entrees: true,
		plats: true,
		desserts: true,
	});

	// Plats personnalisés
	const [customPlats, setCustomPlats] = useState<Plat[]>([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingPlat, setEditingPlat] = useState<Plat | null>(null);
	const [successMessage, setSuccessMessage] = useState("");

	const [formData, setFormData] = useState<Omit<Plat, "id" | "isCustom">>({
		nom: "",
		categorie: "plat",
		prix: "",
		description: "",
		ingredients: [],
		vegetalien: false,
		vegetarien: false,
		sans_gluten: false,
		sans_lactose: false,
		image_URL: "",
	});

	useEffect(() => {
		const savedFilters = DataSyncService.getMenuFilters();
		setFilters(savedFilters);
		loadPlats();

		const handleUpdate = () => loadPlats();
		window.addEventListener("platsUpdated", handleUpdate);
		return () => window.removeEventListener("platsUpdated", handleUpdate);
	}, []);

	const loadPlats = () => {
		const plats = DataSyncService.getCustomPlats();
		setCustomPlats(plats);
	};

	// FILTRES
	const handleToggle = (filterKey: keyof MenuFilters) => {
		setFilters((prev) => ({
			...prev,
			[filterKey]: !prev[filterKey],
		}));
	};

	const handleSaveFilters = () => {
		DataSyncService.saveMenuFilters(filters);
		showSuccess("✅ Filtres sauvegardés ! La galerie a été mise à jour.");
	};

	const handleResetFilters = () => {
		const defaultFilters: MenuFilters = {
			vegetarien: true,
			vegetalien: true,
			sans_gluten: true,
			sans_lactose: true,
			entrees: true,
			plats: true,
			desserts: true,
		};
		setFilters(defaultFilters);
	};

	// PLATS PERSONNALISÉS
	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value, type } = e.target;

		if (type === "checkbox") {
			const checked = (e.target as HTMLInputElement).checked;
			setFormData((prev) => ({ ...prev, [name]: checked }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleIngredientsChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		const ingredients = e.target.value
			.split("\n")
			.map((ing) => ing.trim())
			.filter((ing) => ing.length > 0);

		setFormData((prev) => ({ ...prev, ingredients }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (editingPlat) {
			DataSyncService.updateCustomPlat(editingPlat.id, formData);
			showSuccess("✅ Plat modifié avec succès !");
		} else {
			DataSyncService.addCustomPlat(formData);
			showSuccess("✅ Nouveau plat créé !");
		}

		resetForm();
		loadPlats();
	};

	const handleEdit = (plat: Plat) => {
		setEditingPlat(plat);
		setFormData({
			nom: plat.nom,
			categorie: plat.categorie,
			prix: plat.prix,
			description: plat.description || "",
			ingredients: plat.ingredients || [],
			vegetalien: plat.vegetalien,
			vegetarien: plat.vegetarien,
			sans_gluten: plat.sans_gluten,
			sans_lactose: plat.sans_lactose,
			image_URL: plat.image_URL,
		});
		setIsFormOpen(true);
	};

	const handleDelete = (id: string) => {
		if (confirm("Supprimer ce plat ?")) {
			DataSyncService.deleteCustomPlat(id);
			showSuccess("Plat supprimé");
			loadPlats();
		}
	};

	const resetForm = () => {
		setFormData({
			nom: "",
			categorie: "plat",
			prix: "",
			description: "",
			ingredients: [],
			vegetalien: false,
			vegetarien: false,
			sans_gluten: false,
			sans_lactose: false,
			image_URL: "",
		});
		setEditingPlat(null);
		setIsFormOpen(false);
	};

	const showSuccess = (message: string) => {
		setSuccessMessage(message);
		setTimeout(() => setSuccessMessage(""), 3000);
	};

	const getCategorieLabel = (categorie: string) => {
		const labels = {
			entree: "Entrée",
			plat: "Plat",
			dessert: "Dessert",
		};
		return labels[categorie as keyof typeof labels] || categorie;
	};

	return (
		<div className="menu-management">
			<div className="menu-header">
				<h2> Gestion des Menus</h2>
			</div>

			{successMessage && (
				<div className="success-message">{successMessage}</div>
			)}

			{/* TABS */}
			<div className="menu-tabs">
				<button
					type="button"
					className={activeTab === "filters" ? "active" : ""}
					onClick={() => setActiveTab("filters")}
				>
					Filtres de la Galerie
				</button>
				<button
					type="button"
					className={activeTab === "custom" ? "active" : ""}
					onClick={() => setActiveTab("custom")}
				>
					Mes Plats Personnalisés
				</button>
			</div>

			{/* TAB 1: FILTRES */}
			{activeTab === "filters" && (
				<div className="filters-tab">
					<p className="tab-description">
						Sélectionnez les types de plats à afficher dans la galerie.
					</p>

					<div className="filter-sections">
						<div className="filter-section">
							<h3>🌱 Régimes Alimentaires</h3>
							<div className="filter-grid">
								{[
									{
										key: "vegetarien",
										label: "Végétarien",
										desc: "Sans viande ni poisson",
									},
									{
										key: "vegetalien",
										label: "Végétalien",
										desc: "100% végétal",
									},
									{
										key: "sans_gluten",
										label: "Sans Gluten",
										desc: "Adapté aux intolérances",
									},
									{
										key: "sans_lactose",
										label: "Sans Lactose",
										desc: "Sans produits laitiers",
									},
								].map(({ key, label, desc }) => (
									<label
										key={key}
										className={`filter-checkbox ${filters[key as keyof MenuFilters] ? "checked" : ""}`}
									>
										<input
											type="checkbox"
											checked={filters[key as keyof MenuFilters]}
											onChange={() => handleToggle(key as keyof MenuFilters)}
										/>
										<span className="checkbox-icon">
											{filters[key as keyof MenuFilters] ? "✓" : ""}
										</span>
										<span className="filter-label">
											<strong>{label}</strong>
											<small>{desc}</small>
										</span>
									</label>
								))}
							</div>
						</div>

						<div className="filter-section">
							<h3>🍴 Catégories</h3>
							<div className="filter-grid">
								{[
									{ key: "entrees", label: "Entrées", desc: "Mise en bouche" },
									{ key: "plats", label: "Plats", desc: "Plats principaux" },
									{
										key: "desserts",
										label: "Desserts",
										desc: "Douceurs sucrées",
									},
								].map(({ key, label, desc }) => (
									<label
										key={key}
										className={`filter-checkbox ${filters[key as keyof MenuFilters] ? "checked" : ""}`}
									>
										<input
											type="checkbox"
											checked={filters[key as keyof MenuFilters]}
											onChange={() => handleToggle(key as keyof MenuFilters)}
										/>
										<span className="checkbox-icon">
											{filters[key as keyof MenuFilters] ? "✓" : ""}
										</span>
										<span className="filter-label">
											<strong>{label}</strong>
											<small>{desc}</small>
										</span>
									</label>
								))}
							</div>
						</div>
					</div>

					<div className="filter-actions">
						<button
							type="button"
							onClick={handleResetFilters}
							className="btn-reset"
						>
							↺ Tout afficher
						</button>
						<button
							type="button"
							onClick={handleSaveFilters}
							className="btn-save"
						>
							💾 Sauvegarder
						</button>
					</div>
				</div>
			)}

			{/* TAB 2: PLATS PERSONNALISÉS */}
			{activeTab === "custom" && (
				<div className="custom-tab">
					<div className="custom-header">
						<p className="tab-description">
							Créez vos propres plats qui apparaîtront dans la galerie.
						</p>
						<button
							type="button"
							onClick={() => setIsFormOpen(true)}
							className="btn-add-plat"
						>
							Créer un plat
						</button>
					</div>

					{/* MODAL FORMULAIRE */}
					{isFormOpen && (
						<div className="plat-form-overlay">
							<div className="plat-form-modal">
								<div className="plat-form-header">
									<h3>{editingPlat ? "Modifier" : "Nouveau plat"}</h3>
									<button
										type="button"
										onClick={resetForm}
										className="btn-close"
									>
										×
									</button>
								</div>

								<form onSubmit={handleSubmit} className="plat-form">
									<div className="form-row">
										<div className="form-group">
											<label htmlFor="nom">Nom *</label>
											<input
												type="text"
												id="nom"
												name="nom"
												value={formData.nom}
												onChange={handleInputChange}
												required
												placeholder="Ex: Risotto aux truffes"
											/>
										</div>

										<div className="form-group">
											<label htmlFor="categorie">Catégorie *</label>
											<select
												id="categorie"
												name="categorie"
												value={formData.categorie}
												onChange={handleInputChange}
												required
											>
												<option value="entree">Entrée</option>
												<option value="plat">Plat</option>
												<option value="dessert">Dessert</option>
											</select>
										</div>

										<div className="form-group">
											<label htmlFor="prix">Prix *</label>
											<input
												type="text"
												id="prix"
												name="prix"
												value={formData.prix}
												onChange={handleInputChange}
												required
												placeholder="28 €"
											/>
										</div>
									</div>

									<div className="form-group">
										<label htmlFor="description">Description</label>
										<textarea
											id="description"
											name="description"
											value={formData.description}
											onChange={handleInputChange}
											rows={3}
										/>
									</div>

									<div className="form-group">
										<label htmlFor="ingredients">
											Ingrédients (un par ligne)
										</label>
										<textarea
											id="ingredients"
											name="ingredients"
											value={formData.ingredients?.join("\n") || ""}
											onChange={handleIngredientsChange}
											rows={4}
										/>
									</div>

									<div className="form-group">
										<label htmlFor="image_URL">URL image *</label>
										<input
											type="url"
											id="image_URL"
											name="image_URL"
											value={formData.image_URL}
											onChange={handleInputChange}
											required
											placeholder="https://i.imgur.com/..."
										/>
										{formData.image_URL && (
											<div className="image-preview">
												<img src={formData.image_URL} alt="Aperçu" />
											</div>
										)}
									</div>

									<div className="form-group">
										<span className="form-label">Régimes</span>
										<div className="checkbox-grid">
											{[
												{ key: "vegetarien", label: "🌱 Végétarien" },
												{ key: "vegetalien", label: "🥬 Végétalien" },
												{ key: "sans_gluten", label: "🌾 Sans gluten" },
												{ key: "sans_lactose", label: "🥛 Sans lactose" },
											].map(({ key, label }) => (
												<label key={key} className="checkbox-label">
													<input
														type="checkbox"
														name={key}
														checked={
															formData[key as keyof typeof formData] as boolean
														}
														onChange={handleInputChange}
													/>
													<span>{label}</span>
												</label>
											))}
										</div>
									</div>

									<div className="form-actions">
										<button
											type="button"
											onClick={resetForm}
											className="btn-cancel"
										>
											Annuler
										</button>
										<button type="submit" className="btn-submit">
											{editingPlat ? "💾 Enregistrer" : "➕ Créer"}
										</button>
									</div>
								</form>
							</div>
						</div>
					)}

					{/* LISTE PLATS */}
					<div className="plats-list">
						{customPlats.length === 0 ? (
							<div className="no-plats">
								<p>Aucun plat personnalisé.</p>
							</div>
						) : (
							<div className="plats-grid">
								{customPlats.map((plat) => (
									<div key={plat.id} className="plat-card">
										<div className="plat-image">
											<img src={plat.image_URL} alt={plat.nom} />
											<span className="plat-badge">
												{getCategorieLabel(plat.categorie)}
											</span>
										</div>
										<div className="plat-content">
											<h4>{plat.nom}</h4>
											<p className="plat-prix">{plat.prix}</p>
											{plat.description && (
												<p className="plat-desc">{plat.description}</p>
											)}
											<div className="plat-tags">
												{plat.vegetarien && <span className="tag">🌱</span>}
												{plat.vegetalien && <span className="tag">🥬</span>}
												{plat.sans_gluten && <span className="tag">🌾</span>}
												{plat.sans_lactose && <span className="tag">🥛</span>}
											</div>
										</div>
										<div className="plat-actions">
											<button
												type="button"
												onClick={() => handleEdit(plat)}
												className="btn-edit"
											>
												Modifier
											</button>
											<button
												type="button"
												onClick={() => handleDelete(plat.id)}
												className="btn-delete"
											>
												Supprimer
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default MenuManagement;
