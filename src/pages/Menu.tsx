import { useEffect, useState } from "react";
import { isMenuCarte, type Menu as MenuType, type Plat } from "../types/Menu";
import "./Menu.css";

function Menu() {
	const [menus, setMenus] = useState<MenuType[]>([]);
	const [selectedMenu, setSelectedMenu] = useState<MenuType | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchMenus = async () => {
			try {
				const response = await fetch("https://api-strascook.vercel.app/items");
				if (!response.ok) {
					throw new Error("Erreur lors de la récupération des menus");
				}
				const data = await response.json();
				setMenus(data);
				if (data.length > 0) {
					setSelectedMenu(data[0]);
				}
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchMenus();
	}, []);

	if (loading) return <div className="loading">Chargement des menus...</div>;
	if (error) return <div className="error">Erreur: {error}</div>;

	const renderPlat = (plat: Plat, index: number) => (
		<div key={index} className="plat-card">
			<img src={plat.image_URL} alt={plat.nom} className="plat-image" />
			<div className="plat-content">
				{plat.temps && <span className="temps-badge">Temps {plat.temps}</span>}
				<h3>{plat.nom}</h3>
				{plat.description && <p className="description">{plat.description}</p>}

				<div className="ingredients">
					<h4>Ingrédients:</h4>
					<ul>
						{plat.ingredients.map((ing, i) => (
							<li key={i}>{ing}</li>
						))}
					</ul>
				</div>

				<div className="tags">
					{plat.vegetalien && <span className="tag vegan">🌱 Végétalien</span>}
					{plat.vegetarien && (
						<span className="tag vegetarian">🥬 Végétarien</span>
					)}
					{plat.sans_gluten && (
						<span className="tag gluten-free">🌾 Sans gluten</span>
					)}
					{plat.sans_lactose && (
						<span className="tag lactose-free">🥛 Sans lactose</span>
					)}
				</div>
			</div>
		</div>
	);

	const renderMenuDegustation = (menu: MenuType) => {
		if (isMenuCarte(menu)) return null;

		return (
			<div className="menu-degustation">
				<h2>{menu.menu_type}</h2>
				<div className="plats-grid">
					{menu.plats.map((plat, index) => renderPlat(plat, index))}
				</div>
			</div>
		);
	};

	const renderMenuCarte = (menu: MenuType) => {
		if (!isMenuCarte(menu)) return null;

		return (
			<div className="menu-carte">
				<h2>{menu.menu_type}</h2>

				<section className="carte-section">
					<h3 className="section-title">🍴 Entrées</h3>
					<div className="plats-grid">
						{menu.entrees.map((plat, index) => renderPlat(plat, index))}
					</div>
				</section>

				<section className="carte-section">
					<h3 className="section-title">🍽️ Plats</h3>
					<div className="plats-grid">
						{menu.plats.map((plat, index) => renderPlat(plat, index))}
					</div>
				</section>

				<section className="carte-section">
					<h3 className="section-title">🍰 Desserts</h3>
					<div className="plats-grid">
						{menu.desserts.map((plat, index) => renderPlat(plat, index))}
					</div>
				</section>
			</div>
		);
	};

	return (
		<div className="menu-container">
			<h1>Nos Menus StrassCook</h1>

			<div className="menu-selector">
				{menus.map((menu) => (
					<button
						type="button"
						key={menu.id}
						className={`menu-btn ${selectedMenu?.id === menu.id ? "active" : ""}`}
						onClick={() => setSelectedMenu(menu)}
					>
						{menu.menu_type}
					</button>
				))}
			</div>

			{selectedMenu && (
				<div className="menu-display">
					{isMenuCarte(selectedMenu)
						? renderMenuCarte(selectedMenu)
						: renderMenuDegustation(selectedMenu)}
				</div>
			)}
		</div>
	);
}

export default Menu;
