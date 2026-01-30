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

	const getFirstTwoImages = (menu: MenuType): Plat[] => {
		if (isMenuCarte(menu)) {
			const allPlats = [...menu.entrees, ...menu.plats, ...menu.desserts];
			return allPlats.slice(0, 2);
		}
		return menu.plats.slice(0, 2);
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
							<p className="prix">{menu.prix}</p>
						</a>
					))
				) : (
					<p>Aucun menu disponible pour le moment.</p>
				)}
			</div>
			{menus.map((menu) => {
				const firstTwoPlats = getFirstTwoImages(menu);
				return (
					<div className="contenantMenu" id={`menu-${menu.id}`} key={menu.id}>
						<div className="contenantImgMenu">
							{firstTwoPlats.map((plat, index) => (
								<img
									key={`${plat.nom}-${index}`}
									src={plat.image_URL}
									alt={plat.nom}
									className="imgMenu"
								/>
							))}
						</div>

						<div className="carteMenu">
							<h3 className="nomMenu">{menu.menu_type}</h3>
							<p className="prix">{menu.prix}</p>
							<button
								type="button"
								onClick={() => navigate("/reservation")}
								className="menuReservation"
							>
								Réserver dès maintenant
							</button>
						</div>

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
				<div>
					<p className="question">
						<strong>Les plats changent-ils selon la saison ?</strong>
					</p>
					<p className="reponse">
						Oui. Le chef élabore ses menus en fonction des arrivages et des
						produits de saison, soigneusement sélectionnés pour leur fraîcheur
						et leur qualité. Chaque assiette reflète les grands classiques
						français, revisités avec élégance et créativité. Voir les menus et
						tarifs ici créations du chef
					</p>
				</div>
				<div>
					<p className="question">
						<strong>À quel moment dois-je confirmer le menu?</strong>
					</p>
					<p className="reponse">
						Pour une organisation optimale, il est recommandé de confirmer votre
						menu au moins une semaine avant la prestation. Ce délai permet au
						chef Michel Hélène et à son équipe de planifier chaque détail,
						sélectionner les produits les plus frais, et s'assurer de la
						disponibilité des ingrédients souhaités. En confirmant votre choix à
						l'avance, vous donnez également la possibilité au chef de vous
						proposer des alternatives adaptées si un produit n'est pas
						disponible, tout en garantissant que vos demandes spécifiques soient
						prises en compte. Cette anticipation est la clé pour vous offrir une
						expérience gastronomique fluide, sur mesure et à la hauteur de vos
						attentes.
					</p>
				</div>
				<div>
					<p className="question">
						<strong>Puis-je faire des demandes spéciales?</strong>
					</p>
					<p className="reponse">
						Oui. Le chef est à l'écoute de vos envies et peut adapter ses
						propositions en fonction de vos besoins spécifiques. Bien qu'il
						mette en avant ses créations gastronomiques qu'il maîtrise à la
						perfection, il comprend l'importance d'être flexible pour offrir une
						expérience sur mesure à chaque client. Le chef propose généralement
						trois menus différents, chacun comprenant plusieurs choix d'entrées,
						de plats et de desserts. Cela vous permet de composer un repas qui
						correspond à vos goûts, tout en restant dans l'esprit raffiné qui
						caractérise sa cuisine. Si vous avez une allergie alimentaire, une
						intolérance ou une demande particulière, nous vous recommandons de
						nous en informer le plus tôt possible. Ainsi, le chef pourra adapter
						ses recettes, sélectionner les produits appropriés et s'assurer que
						votre repas soit à la fois savoureux et parfaitement sûr.
					</p>
				</div>
				<div>
					<p className="question">
						<strong>Les plats sont-ils préparés sur place?</strong>
					</p>
					<p className="reponse">
						Le chef privilégie une préparation et une cuisson sur place afin de
						garantir fraîcheur, qualité et saveur optimale. Les viandes et
						poissons sont ainsi cuits au dernier moment, pour que vous puissiez
						profiter de textures parfaites et de parfums intenses. Certains
						éléments, comme les jus de viande, les fonds ou certaines sauces,
						nécessitent plusieurs heures de cuisson lente pour développer toute
						leur richesse aromatique. Ces préparations peuvent donc être
						réalisées à l'avance, dans les règles de l'art, afin d'être prêtes à
						sublimer votre repas. En somme, chaque étape est pensée pour vous
						offrir une véritable expérience gastronomique à domicile, où la
						précision des cuissons et la qualité des produits se retrouvent dans
						chaque assiette.
					</p>
				</div>
				<div>
					<p className="question">
						<strong>
							Y a-t-il des restrictions alimentaires ou des ingrédients
							allergènes dans les plats?
						</strong>
					</p>
					<p className="reponse">
						Le chef Michel Hélène prend en compte les restrictions alimentaires
						et les allergies de ses clients lors de la préparation des plats. Il
						utilise des ingrédients frais et de qualité, et peut s'adapter en
						cas d'allergies ou d'intolérances alimentaires. Si vous avez des
						allergies ou des intolérances alimentaires, il est recommandé de
						communiquer cela au chef avant la préparation du repas afin qu'il
						puisse ajuster les ingrédients en conséquence. Le Chef est également
						disponible pour discuter de vos préférences et besoins alimentaires
						pour s'assurer que le repas soit adapté à vos goûts et vos besoins.
						En résumé, le chef Michel Hélène est attentif aux restrictions
						alimentaires et aux allergies de ses clients, et travaille pour
						offrir des repas adaptés à leurs besoins spécifiques.
					</p>
				</div>
				<div>
					<p className="question">
						<strong>Comment se déroule le service ?</strong>
					</p>
					<p className="reponse">
						Le chef vous propose un service à domicile inspiré des plus belles
						tables gastronomiques. Le repas est orchestré avec la présence
						indispensable de son maître d'hôtel, garant d'un déroulement fluide
						et élégant du début à la fin Discret et efficace, il veille à ce que
						vous profitiez pleinement de vos convives sans jamais interrompre
						vos échanges ou votre intimité. Son rôle est d'assurer un service
						irréprochable, anticiper vos besoins et veiller à ce que chaque
						détail soit parfait. À la fin du repas, tout est laissé dans un état
						impeccable : la vaisselle est lavée, la machine à laver vidée, la
						cuisine propre et rangée… comme si nous n'étions jamais passés, à
						part pour les souvenirs gourmands laissés à votre table.
					</p>
				</div>
			</div>
		</div>
	);
}
export default Menu;
