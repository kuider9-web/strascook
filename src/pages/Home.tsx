import { useEffect, useState } from "react";

import cloche from "../asset/image/cloche.png";
import plat from "../asset/image/plat.png";

import type { Menu as MenuType } from "../types/Menu";
import "./Home.css";

function Home() {
	const [menus, setMenus] = useState<MenuType[]>([]);

	useEffect(() => {
		fetch("https://api-strascook.vercel.app/items")
			.then((res) => res.json())
			.then((data: MenuType[]) => setMenus(data))
			.catch((err) => console.error(err));
	}, []);

	const getImageForSection = (section: string): string => {
		if (menus.length === 0) return plat;

		const imageMap: Record<string, string> = {
			menu: "https://i.imgur.com/7YXz15V.png",
			galerie: "https://i.imgur.com/dEIWa8Y.png",
			reservation: "https://i.imgur.com/PR8hUSe.png",
			apropos1: "https://i.imgur.com/XUtzeej.png",
			apropos2: "https://i.imgur.com/XWk7vTl.png",
			apropos3: "https://i.imgur.com/RzLdQAz.png",
		};

		return imageMap[section] || plat;
	};

	return (
		<div>
			<div className="presentation">
				<h2>L'expérience avant tout</h2>
				<br />
				<p>
					La cuisine est avant tout un moment de partage.
					<br />
					Ici, elle s'invite chez vous sous forme de menus soigneusement pensés,
					inspirés des tendances actuelles :<br />
					cuisine végétale, vegan, équilibrée ou créative.
					<br />
					Pas de mise en scène inutile :<br />
					les plats sont au cœur de l'expérience, accompagnés d'une ambiance
					chaleureuse et authentique, fidèle à l'esprit de la cuisine à
					domicile.
				</p>

				<div className="service">
					<div className="clocheConteneur">
						<img src={cloche} alt="cloche" className="cloche" />
						<p>Cheffe à Domicile</p>
					</div>
					<div className="clocheConteneur">
						<img src={cloche} alt="cloche" className="cloche" />
						<p>Cheffe événementielle</p>
					</div>
					<div className="clocheConteneur">
						<img src={cloche} alt="cloche" className="cloche" />
						<p>Produits de saisons</p>
					</div>
				</div>
			</div>

			<div className="selectionNav">
				{["menu", "galerie", "reservation"].map((section) => (
					<a key={section} href={`./${section}`} className="menuNav">
						<img
							src={getImageForSection(section)}
							alt="plat"
							className="imgNav"
						/>
						<h3 className="titreMenuNav">
							{section === "menu"
								? "Les Menus"
								: section.charAt(0).toUpperCase() + section.slice(1)}
						</h3>
						<p className="description">
							La cuisine est avant tout un
							<br />
							moment de partage.
							<br />
							Ici, elle s'invite chez vous sous
							<br />
							forme de menus
							<br />
							soigneusement pensés,
							<br />
							inspirés des tendances.
						</p>
					</a>
				))}
			</div>

			<div className="aPropo">
				<img
					src={getImageForSection("apropos1")}
					alt="plat"
					className="imgNav"
				/>
				<div>
					<img src={cloche} alt="cloche" className="cloche" />
					<h3 className="concept">
						Cheffe
						<br /> à domicile.
					</h3>
				</div>
				<p>
					Offrez-vous les services d'un restaurant
					<br />
					gastronomique à votre domicile. Des plats dignes de
					<br />
					grands chefs étoilés seront préparés sous votre toit,
					<br />
					êtes-vous prêt à vivre une expérience culinaire unique ?
				</p>
			</div>

			<div className="aPropo">
				<p>
					Confiez la mise en bouche de vos événements
					<br />
					professionnels à une cheffe privée reconnue.
					<br />
					Une large gamme de prestations a été pensée pour
					<br />
					séduire les plus exigeants d'entre vous.
				</p>
				<div>
					<img src={cloche} alt="cloche" className="cloche" />
					<h3 className="concept">
						Cheffe
						<br /> événementielle.
					</h3>
				</div>
				<img
					src={getImageForSection("apropos2")}
					alt="plat"
					className="imgNav"
				/>
			</div>

			<div className="aPropo">
				<img
					src={getImageForSection("apropos3")}
					alt="plat"
					className="imgNav"
				/>
				<div>
					<img src={cloche} alt="cloche" className="cloche" />
					<h3 className="concept">
						Produits de
						<br /> saisons.
					</h3>
				</div>
				<p>
					Chaque menu que je propose est une création
					<br />
					unique, pensée comme une rencontre entre la
					<br />
					nature, le moment et vous. Je compose mes plats
					<br />
					au rythme des saisons, en mettant à l'honneur des
					<br />
					produits frais et locaux, et soigneusement sélectionnés.
					<br />
					Plus qu'un simple repas, chaque menu
					<br />
					raconte une histoire : celle d'un terroir,
					<br />
					d'un instant, d'une émotion.
				</p>
			</div>
		</div>
	);
}

export default Home;
