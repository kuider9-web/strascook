import { useEffect, useState } from "react";
import { usePanier } from "../context/PanierContext";
import type { MenuFilters } from "../services/dataSync";
import DataSyncService from "../services/dataSync";
import "./Galerie.css";

interface Dish {
	temps?: number;
	categorie: "entree" | "plat" | "dessert";
	nom: string;
	description?: string;
	ingredients: string[];
	vegetalien: boolean;
	vegetarien: boolean;
	sans_gluten: boolean;
	sans_lactose: boolean;
	image_URL: string;
	prix?: string;
}

interface Menu {
	id: number;
	menu_type: string;
	prix?: string;
	entrees: Dish[];
	plats: Dish[];
	desserts: Dish[];
}

type FilterType =
	| "all"
	| "vegetarien"
	| "vegetalien"
	| "sans_gluten"
	| "sans_lactose";
type CategoryFilter = "all" | "entree" | "plat" | "dessert";

const Galerie = () => {
	const { ajoutPanier } = usePanier();
	const [_menus, setMenus] = useState<Menu[]>([]);
	const [allDishes, setAllDishes] = useState<Dish[]>([]);
	const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [dietaryFilter, setDietaryFilter] = useState<FilterType>("all");
	const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
	const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

	// 🔥 Fonction pour charger tous les plats (API + personnalisés)
	const loadAllDishes = async () => {
		try {
			setLoading(true);

			// 1. Récupère les plats de l'API
			const response = await fetch("/data.json");

			if (!response.ok) {
				throw new Error("Erreur lors de la récupération des données");
			}

			const data: Menu[] = await response.json();
			setMenus(data);

			// Extraire tous les plats de l'API
			const apiDishes: Dish[] = [];
			for (const menu of data) {
				apiDishes.push(...(menu.entrees || []), ...menu.plats, ...(menu.desserts || []));
			}

			// 2. Récupère les plats personnalisés du chef
			const customPlats = DataSyncService.getCustomPlats();

			// Convertir les plats personnalisés au format Dish
			const customDishes: Dish[] = customPlats.map((plat) => ({
				categorie: plat.categorie,
				nom: plat.nom,
				description: plat.description || "",
				ingredients: plat.ingredients || [],
				vegetalien: plat.vegetalien,
				vegetarien: plat.vegetarien,
				sans_gluten: plat.sans_gluten,
				sans_lactose: plat.sans_lactose,
				image_URL: plat.image_URL,
				prix: plat.prix,
			}));

			// 3. Fusionne les plats de l'API + les plats perso
			const allDishesData = [...apiDishes, ...customDishes];

			setAllDishes(allDishesData);
			setFilteredDishes(allDishesData);
			setLoading(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Une erreur est survenue");
			setLoading(false);
		}
	};

	// Chargement initial
	useEffect(() => {
		loadAllDishes();
	}, []);

	// Écoute les ajouts/suppressions de plats perso
	useEffect(() => {
		const handlePlatsUpdate = () => {
			loadAllDishes(); // Recharge tout
		};

		window.addEventListener("platsUpdated", handlePlatsUpdate);

		return () => {
			window.removeEventListener("platsUpdated", handlePlatsUpdate);
		};
	}, []);

	// Écoute les changements de filtres du chef
	useEffect(() => {
		const handleFiltersUpdate = () => {
			setDietaryFilter((prev) => prev);
		};

		window.addEventListener("menuFiltersUpdated", handleFiltersUpdate);

		return () => {
			window.removeEventListener("menuFiltersUpdated", handleFiltersUpdate);
		};
	}, []);

	// Filtrage des plats (avec filtres du chef + filtres utilisateur)
	useEffect(() => {
		let filtered = [...allDishes];

		// ÉTAPE 1 : Applique les filtres du CHEF
		const chefFilters: MenuFilters = DataSyncService.getMenuFilters();

		const activeDietFilters = [
			chefFilters.vegetarien,
			chefFilters.vegetalien,
			chefFilters.sans_gluten,
			chefFilters.sans_lactose,
		];
		const hasAnyDietFilter = activeDietFilters.some((f) => f === true);

		if (hasAnyDietFilter) {
			filtered = filtered.filter((dish) => {
				return (
					(chefFilters.vegetarien && dish.vegetarien) ||
					(chefFilters.vegetalien && dish.vegetalien) ||
					(chefFilters.sans_gluten && dish.sans_gluten) ||
					(chefFilters.sans_lactose && dish.sans_lactose)
				);
			});
		}

		filtered = filtered.filter((dish) => {
			if (dish.categorie === "entree") return chefFilters.entrees;
			if (dish.categorie === "plat") return chefFilters.plats;
			if (dish.categorie === "dessert") return chefFilters.desserts;
			return true;
		});

		// ÉTAPE 2 : Applique les filtres de l'UTILISATEUR
		if (dietaryFilter !== "all") {
			filtered = filtered.filter((dish) => {
				switch (dietaryFilter) {
					case "vegetarien":
						return dish.vegetarien;
					case "vegetalien":
						return dish.vegetalien;
					case "sans_gluten":
						return dish.sans_gluten;
					case "sans_lactose":
						return dish.sans_lactose;
					default:
						return true;
				}
			});
		}

		if (categoryFilter !== "all") {
			filtered = filtered.filter((dish) => dish.categorie === categoryFilter);
		}

		setFilteredDishes(filtered);
	}, [dietaryFilter, categoryFilter, allDishes]);

	// Gestion du modal
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && selectedDish) {
				setSelectedDish(null);
			}
		};

		if (selectedDish) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [selectedDish]);

	const dietaryLabels = {
		all: "Tous les plats",
		vegetarien: "🌱 Végétarien",
		vegetalien: "🥬 Végétalien",
		sans_gluten: "🌾 Sans Gluten",
		sans_lactose: "🥛 Sans Lactose",
	};

	const categoryLabels = {
		all: "Toutes catégories",
		entree: "Entrées",
		plat: "Plats",
		dessert: "Desserts",
	};

	const getDishBadges = (dish: Dish) => {
		const badges = [];
		if (dish.vegetalien)
			badges.push({ label: "🥬 Végétalien", color: "green" });
		else if (dish.vegetarien)
			badges.push({ label: "🌱 Végétarien", color: "lightgreen" });
		if (dish.sans_gluten)
			badges.push({ label: "🌾 Sans Gluten", color: "orange" });
		if (dish.sans_lactose)
			badges.push({ label: "🥛 Sans Lactose", color: "blue" });
		return badges;
	};

	if (loading) {
		return (
			<div className="galerie-container">
				<div className="galerie-loading">
					<p>Chargement de nos créations culinaires...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="galerie-container">
				<div className="galerie-error">
					<p>❌ {error}</p>
					<button type="button" onClick={() => window.location.reload()}>
						Réessayer
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="galerie-container">
			<header className="galerie-header">
				<h1>Notre Galerie Culinaire</h1>
				<p className="galerie-subtitle">
					Découvrez nos créations gastronomiques, alliant saveurs raffinées et
					présentation artistique
				</p>
			</header>

			<nav className="galerie-filters">
				<div className="filter-group">
					<h3>Préférences alimentaires</h3>
					<div className="filter-buttons">
						{(Object.keys(dietaryLabels) as FilterType[]).map((filter) => (
							<button
								key={filter}
								className={`filter-button ${dietaryFilter === filter ? "active" : ""}`}
								onClick={() => setDietaryFilter(filter)}
								type="button"
							>
								{dietaryLabels[filter]}
							</button>
						))}
					</div>
				</div>

				<div className="filter-group">
					<h3>Type de plat</h3>
					<div className="filter-buttons">
						{(Object.keys(categoryLabels) as CategoryFilter[]).map(
							(category) => (
								<button
									key={category}
									className={`filter-button ${categoryFilter === category ? "active" : ""}`}
									onClick={() => setCategoryFilter(category)}
									type="button"
								>
									{categoryLabels[category]}
								</button>
							),
						)}
					</div>
				</div>
			</nav>

			<div className="results-count">
				<p>
					{filteredDishes.length} {filteredDishes.length > 1 ? "plats" : "plat"}{" "}
					disponible{filteredDishes.length > 1 ? "s" : ""}
				</p>
			</div>

			<div className="galerie-grid">
				{filteredDishes.map((dish, index) => (
					<button
						key={`${dish.nom}-${index}`}
						className="galerie-item"
						onClick={() => setSelectedDish(dish)}
						type="button"
						aria-label={`Voir les détails de ${dish.nom}`}
					>
						<img src={dish.image_URL} alt={dish.nom} loading="lazy" />
						<div className="galerie-overlay">
							<h3>{dish.nom}</h3>
							{dish.prix && <span className="card-price">{dish.prix}</span>}
							<div className="dish-badges-preview">
								{getDishBadges(dish)
									.slice(0, 2)
									.map((badge) => (
										<span key={badge.label} className="badge-mini">
											{badge.label.split(" ")[0]}
										</span>
									))}
							</div>
						</div>
					</button>
				))}
			</div>

			{filteredDishes.length === 0 && (
				<div className="galerie-empty">
					<p>😔 Aucun plat ne correspond à vos critères.</p>
					<button
						type="button"
						onClick={() => {
							setDietaryFilter("all");
							setCategoryFilter("all");
						}}
						className="reset-filters-button"
					>
						Réinitialiser les filtres
					</button>
				</div>
			)}

			{selectedDish && (
				<div
					className="galerie-modal"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-title"
				>
					<button
						className="modal-overlay"
						onClick={() => setSelectedDish(null)}
						type="button"
						aria-label="Fermer les détails"
					/>

					<div className="modal-content-detailed">
						<button
							className="modal-close"
							onClick={() => setSelectedDish(null)}
							type="button"
							aria-label="Fermer"
						>
							×
						</button>

						<div className="modal-image-section">
							<img src={selectedDish.image_URL} alt={selectedDish.nom} />
						</div>

						<div className="modal-details">
							<div className="modal-header">
								<h2 id="modal-title">{selectedDish.nom}</h2>
								<span className="dish-category">
									{categoryLabels[selectedDish.categorie]}
								</span>
							</div>

							{selectedDish.description && (
								<p className="dish-description">{selectedDish.description}</p>
							)}

							<div className="dish-badges">
								{getDishBadges(selectedDish).map((badge) => (
									<span
										key={badge.label}
										className="badge"
										style={{ backgroundColor: badge.color }}
									>
										{badge.label}
									</span>
								))}
							</div>

							<div className="dish-ingredients">
								<h3>Ingrédients</h3>
								<ul>
									{selectedDish.ingredients.map((ingredient, idx) => (
										<li key={idx}>{ingredient}</li>
									))}
								</ul>
							</div>

							{selectedDish.prix && (
								<div className="dish-price">
									<span className="price-label">Prix :</span>
									<span className="price-value">{selectedDish.prix}</span>
								</div>
							)}

							<button
								type="button"
								className="reservation-button"
								onClick={() => {
									if (!selectedDish.prix) return;
									ajoutPanier({
										nom: selectedDish.nom,
										prix: selectedDish.prix,
										image_URL: selectedDish.image_URL,
									});
									setSelectedDish(null);
								}}
								disabled={!selectedDish.prix}
							>
								{selectedDish.prix
									? "Ajouter au panier"
									: "Prix non disponible"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Galerie;
