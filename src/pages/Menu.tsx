import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import plat from "../asset/image/plat.png";
import { isMenuCarte, type Menu as MenuType, type Plat } from "../types/Menu";
import "./Menu.css";

function Menu() {
	const navigate = useNavigate();

	const [menus, setMenus] = useState<MenuType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [openFaq, setOpenFaq] = useState<number | null>(null);

	useEffect(() => {
		setLoading(true);
		fetch("https://api-strascook.vercel.app/items")
			.then((res) => {
				if (!res.ok) {
					throw new Error("Erreur lors du chargement des menus");
				}
				return res.json();
			})
			.then((data: MenuType[]) => {
				setMenus(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setError(
					"Impossible de charger les menus. Veuillez réessayer plus tard.",
				);
				setLoading(false);
			});
	}, []);

	const getPlatsCount = (menu: MenuType): number => {
		if (isMenuCarte(menu)) {
			return menu.entrees.length + menu.plats.length + menu.desserts.length;
		}
		return menu.plats.length;
	};

	const getMenuImage = (menu: MenuType): string => {
		const menuImages: { [key: number]: string } = {
			101: "https://i.imgur.com/7YXz15V.png",
			102: "https://i.imgur.com/dEIWa8Y.png",
			103: "https://i.imgur.com/PR8hUSe.png",
		};

		return menuImages[menu.id] || plat;
	};

	const getOptimalImageCount = (menu: MenuType): number => {
		const totalPlats = getPlatsCount(menu);

		if (totalPlats <= 4) {
			return 3;
		} else if (totalPlats <= 8) {
			return 4;
		} else {
			return 6;
		}
	};

	const getMenuImages = (menu: MenuType): Plat[] => {
		const imageCount = getOptimalImageCount(menu);

		if (isMenuCarte(menu)) {
			const allPlats = [...menu.entrees, ...menu.plats, ...menu.desserts];
			return allPlats.slice(0, imageCount);
		}
		return menu.plats.slice(0, imageCount);
	};

	const renderPlats = (menu: MenuType) => {
		if (isMenuCarte(menu)) {
			return (
				<>
					{menu.entrees.length > 0 && (
						<div className="section">
							<h5>Entrées</h5>
							{menu.entrees.map((plat) => (
								<div key={plat.nom}>
									<h4>{plat.nom}</h4>
									<p>{plat.ingredients?.join(" │ ") || ""}</p>
								</div>
							))}
						</div>
					)}
					{menu.plats.length > 0 && (
						<div className="section">
							<h5>Plats</h5>
							{menu.plats.map((plat) => (
								<div key={plat.nom}>
									<h4>{plat.nom}</h4>
									<p>{plat.ingredients?.join(" │ ") || ""}</p>
								</div>
							))}
						</div>
					)}
					{menu.desserts.length > 0 && (
						<div className="section">
							<h5>Desserts</h5>
							{menu.desserts.map((plat) => (
								<div key={plat.nom}>
									<h4>{plat.nom}</h4>
									<p>{plat.ingredients?.join(" │ ") || ""}</p>
								</div>
							))}
						</div>
					)}
				</>
			);
		}

		return menu.plats.map((plat) => (
			<div key={plat.nom}>
				<h4>{plat.nom}</h4>
				<p>{plat.ingredients?.join(" │ ") || ""}</p>
			</div>
		));
	};

	if (loading) {
		return (
			<div className="loading">
				<p>Chargement des menus...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="error">
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div>
			<div className="enTete">
				<h1>Menus et Tarifs</h1>
				<p>
					Les menus évoluent selon les arrivages et les saisons:
					<br />
					fleurs, herbes et légumes éphémères s'invitent selon leur
					disponibilité
				</p>
			</div>
			<div className="presentation">
				<h2>Une expérience culinaire à la carte</h2>
				<p>
					Chez Gastronomique, chaque repas est pensé sur mesure, avec des
					produits de saison,
					<br />
					locaux et cuisinés avec exigence.
					<br />
					Que ce soit pour un dîner intimiste ou un événement d'envergure, nos
					formules s'adaptent
					<br />à vos envies, à votre budget et à votre ambiance.
					<br />
					<br />
					Mes prestations sont proposées à partir de 4 convives, afin de
					garantir un service fluide et
					<br />
					complet avec un maître d'hôtel.
				</p>
			</div>
			<div className="choixDesMenu">
				{menus.length > 0 ? (
					menus.map((menu) => (
						<a key={menu.id} href={`#menu-${menu.id}`} className="menu">
							<img
								src={getMenuImage(menu)}
								alt={menu.menu_type}
								className="plat"
							/>
							<h3 className="titreMenu">{menu.menu_type}</h3>
							<p className="prix">{menu.prix_menu}</p>
						</a>
					))
				) : (
					<p>Aucun menu disponible pour le moment.</p>
				)}
			</div>
			{menus.map((menu) => {
				const menuImages = getMenuImages(menu);
				const imageCount = menuImages.length;

				return (
					<div
						className={`contenantMenu contenantMenu--${imageCount}-images`}
						id={`menu-${menu.id}`}
						key={menu.id}
					>
						{/* COLONNE GAUCHE - Images + Info Menu */}
						<div>
							{/* Images en grille */}
							<div className="contenantImgMenu">
								{menuImages.map((plat, index) => (
									<img
										key={`${plat.nom}-${index}`}
										src={plat.image_URL}
										alt={plat.nom}
										className="imgMenu"
									/>
								))}
							</div>

							{/* Carte menu en dessous des images */}
							<div className="carteMenu">
								<h3 className="nomMenu">{menu.menu_type}</h3>
								<p className="prix">{menu.prix_menu}</p>
								<button
									type="button"
									onClick={() => navigate("/reservation")}
									className="menuReservation"
								>
									Réserver dès maintenant
								</button>
							</div>
						</div>

						{/* COLONNE DROITE - Liste des plats */}
						<div className="composantMenu">
							{getPlatsCount(menu) > 0 ? (
								renderPlats(menu)
							) : (
								<p>Aucun plat disponible pour ce menu.</p>
							)}
						</div>
					</div>
				);
			})}
			<div className="conteneurQuestion">
				<h2>À savoir pour votre expérience</h2>
				{[
					{
						q: "Les plats changent-ils selon la saison ?",
						r: "Oui. Le chef élabore ses menus en fonction des arrivages et des produits de saison, soigneusement sélectionnés pour leur fraîcheur et leur qualité. Chaque assiette reflète les grands classiques français, revisités avec élégance et créativité.",
					},
					{
						q: "À quel moment dois-je confirmer le menu ?",
						r: "Pour une organisation optimale, il est recommandé de confirmer votre menu au moins une semaine avant la prestation. Ce délai permet au chef et à son équipe de planifier chaque détail, sélectionner les produits les plus frais, et s'assurer de la disponibilité des ingrédients souhaités.",
					},
					{
						q: "Puis-je faire des demandes spéciales ?",
						r: "Oui. Le chef est à l'écoute de vos envies et peut adapter ses propositions en fonction de vos besoins spécifiques. Si vous avez une allergie alimentaire, une intolérance ou une demande particulière, nous vous recommandons de nous en informer le plus tôt possible.",
					},
					{
						q: "Les plats sont-ils préparés sur place ?",
						r: "Le chef privilégie une préparation et une cuisson sur place afin de garantir fraîcheur, qualité et saveur optimale. Les viandes et poissons sont cuits au dernier moment. Certaines sauces nécessitant plusieurs heures de cuisson peuvent être préparées à l'avance.",
					},
					{
						q: "Y a-t-il des ingrédients allergènes dans les plats ?",
						r: "Le chef prend en compte les restrictions alimentaires et les allergies. Il utilise des ingrédients frais et de qualité, et peut s'adapter en cas d'allergies ou d'intolérances. Informez-le avant la prestation pour qu'il puisse ajuster les ingrédients.",
					},
					{
						q: "Comment se déroule le service ?",
						r: "Le chef vous propose un service à domicile inspiré des plus belles tables gastronomiques, avec la présence de son maître d'hôtel. À la fin du repas, tout est laissé dans un état impeccable : vaisselle lavée, cuisine propre et rangée.",
					},
				].map((item, i) => (
					<div key={item.q} className={`faq-item${openFaq === i ? " open" : ""}`}>
						<button
							type="button"
							className="question"
							onClick={() => setOpenFaq(openFaq === i ? null : i)}
							aria-expanded={openFaq === i}
						>
							<strong>{item.q}</strong>
							<span className="faq-chevron">{openFaq === i ? "▲" : "▼"}</span>
						</button>
						{openFaq === i && <p className="reponse">{item.r}</p>}
					</div>
				))}
			</div>
		</div>
	);
}
export default Menu;
