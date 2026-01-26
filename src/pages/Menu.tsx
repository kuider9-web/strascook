import { useEffect, useState } from "react";

interface Menu {
	id: number;
	nom: string;
	description: string;
	ingredients: string[];
	vegetalien: boolean;
	vegetarien: boolean;
	sans_gluten: boolean;
	sans_lactose: boolean;
	image_url: string;
}

function Menu() {
	const [menus, setMenus] = useState<Menu[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('https://api-strascook.vercel.app/items');
        if (!response.ok) {
					throw new Error('Erreur lors de la récupération des données');
				}
				const result = await response.json();
				setMenus(result);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				}
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	if (loading) return <p>Chargement...</p>;
	if (error) return <p style={{ color: 'red' }}>Erreur: {error}</p>;

	return (
		<div className="container">
			<h1>Nos Menus</h1>
			<div className="menus-grid">
				{menus.map((menu) => (
					<div key={menu.id} className="menu-card">
						<img src={menu.image_url} alt={menu.nom} className="menu-image" />
						<div className="menu-content">
							<h2>{menu.nom}</h2>
							<p className="description">{menu.description}</p>
							<div className="ingredients">
								<h3>Ingrédients:</h3>
								<ul>
									{menu.ingredients.map((ingredient, index) => (
										<li key={index}>{ingredient}</li>
									))}
								</ul>
							</div>
							<div className="tags">
								{menu.vegetalien && <span className="tag vegan">Végétalien</span>}
								{menu.vegetarien && <span className="tag vegetarian">Végétarien</span>}
								{menu.sans_gluten && <span className="tag gluten-free">Sans gluten</span>}
								{menu.sans_lactose && <span className="tag lactose-free">Sans lactose</span>}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Menu;