import { useNavigate } from "react-router-dom";
import plat from "../asset/image/plat.png";
import "./Menu.css";

function Menu() {
	const navigate = useNavigate();

	return (
		<div>
			<div className="hero">
				<h1>Menus et Tarifs</h1>
				<p>
					Les menus évoluent selon les arrivages et les saisons:
					<br />
					fleurs, herbes et légumes éphémères s’invitent selon leur
					disponibilité
				</p>
				<button
					type="button"
					onClick={() => navigate("/reservation")}
					className="menuReservation"
				>
					Réserver dès maintenant
				</button>
			</div>
			<div className="presentation">
				<h2>Une expérience culinaire à la carte</h2>
				<p>
					Chez Gastronomique, chaque repas est pensé sur mesure, avec des
					produits de saison,
					<br />
					locaux et cuisinés avec exigence.
					<br />
					Que ce soit pour un dîner intimiste ou un événement d’envergure, nos
					formules s’adaptent
					<br />à vos envies, à votre budget et à votre ambiance.
					<br />
					<br />
					Mes prestations sont proposées à partir de 4 convives, afin de
					garantir un service fluide et
					<br />
					complet avec un maître d’hôtel.
				</p>
			</div>
			<div className="choixDesMenu">
				<a href="#menu-4-temps" className="menu">
					<img src={plat} alt="plat" className="plat" />
					<h3 className="titreMenu">Menu Croisière</h3>
					<p className="prix">
						120 €<br />
						En 4 temps
					</p>
				</a>
				<a href="#menu-5-temps" className="menu">
					<img src={plat} alt="plat" className="plat" />
					<h3 className="titreMenu">Menu Croisière</h3>
					<p className="prix">
						150 €<br />
						En 5 temps
					</p>
				</a>
				<a href="#menu-6-temps" className="menu">
					<img src={plat} alt="plat" className="plat" />
					<h3 className="titreMenu">Menu Croisière</h3>
					<p className="prix">
						200 €<br />
						En 6 temps
					</p>
				</a>
			</div>
			<div className="contenantMenu" id="menu-4-temps">
				<div className="contenantImgMenu">
					<img src={plat} alt="" className="imgMenu" />
					<img src={plat} alt="" className="imgMenu" />
				</div>
				<div className="carteMenu">
					<h3 className="nomMenu">Menu Croisière.</h3>
					<p className="tarifMenu">
						( 120€ par personne,
						<br />4 bouchées, 1 entrée,
						<br />1 plat, 1 dessert)
					</p>
					<button
						type="button"
						onClick={() => navigate("/reservation")}
						className="menuReservation"
					>
						Réserver dès maintenant
					</button>
				</div>
				<div className="composantMenu">
					<h4>La Mise en Bouche</h4>
					<p>4 bouchées selon l’inspiration du chef</p>
					<p>
						<em>
							<strong>( Les entrées )</strong>
						</em>
					</p>
					<h4>Le Ceviche</h4>
					<p>Combava │ Daurade │ Tagète</p>
					<h4>La Saint-Jacques</h4>
					<p>Shiso │Saint-Jacques │Vanille</p>
					<h4>Les Ravioles</h4>
					<p>Gambas │foie-gras │ chou-fleur</p>
					<p>
						<em>
							<strong>( Les plats )</strong>
						</em>
					</p>
					<h4>Le Poisson</h4>
					<p>Mertensia │ Bar│Champagne</p>
					<h4>La Viande</h4>
					<p>Veau │Armagnac │Carotte</p>
					<p>
						<em>
							<strong>( Les desserts )</strong>
						</em>
					</p>
					<h4>Le Chocolat</h4>
					<p>Chocolat noir │ Vanille │ Orange</p>
					<h4>La Vanille</h4>
					<p>Vanille │ Caramel │ Café</p>
					<h4>Le Sorbet</h4>
					<p>Fruits de saison │ Amaretto │ Herbes fines</p>
					<h4>La Poire</h4>
					<p>Poire de Gambais │ Pistache │Chocolat</p>
				</div>
			</div>
			<div className="contenantMenu" id="menu-5-temps">
				<div className="contenantImgMenu">
					<img src={plat} alt="" className="imgMenu" />
					<img src={plat} alt="" className="imgMenu" />
				</div>
				<div className="carteMenu">
					<h3 className="nomMenu">Menu Escale.</h3>
					<p className="tarifMenu">
						( 150€ par personne,
						<br />4 bouchées, amuse-bouche,
						<br />1 entrée, 1 plat, 1 dessert)
					</p>
					<button
						type="button"
						onClick={() => navigate("/reservation")}
						className="menuReservation"
					>
						Réserver dès maintenant
					</button>
				</div>
				<div className="composantMenu">
					<h4>Les bouchées de l’apéritif</h4>
					<p>4 bouchées selon l’inspiration du chef</p>
					<p>
						<em>
							<strong>( Les entrées )</strong>
						</em>
					</p>
					<h4>L’amuse-bouche</h4>
					<p>Surprise du chef</p>
					<h4>La Saint-Jacques</h4>
					<p>Shiso │Saint-Jacques │Vanille</p>
					<h4>Les Ravioles</h4>
					<p>Langoustine │ Foie-gras │Fenouil</p>
					<p>
						<em>
							<strong>( Les plats )</strong>
						</em>
					</p>
					<h4>Le Poisson</h4>
					<p>Poisson du moment │ Safran │ Champagne</p>
					<h4>La Viande</h4>
					<p>Veau │ Morilles │ Armagnac</p>
					<h4>Le pigeon</h4>
					<p>Pigeon │ Vanille │ carotte</p>
					<p>
						<em>
							<strong>( Les desserts )</strong>
						</em>
					</p>
					<h4>Le Chocolat</h4>
					<p>Chocolat noir │ Vanille │ Orange</p>
					<h4>La Fusion Dorée</h4>
					<p>Vanille │ Caramel │ Café</p>
					<h4>Le Sorbet</h4>
					<p>Fruits de saison │ Crumble │ herbes fines</p>
					<h4>La Poire</h4>
					<p>Poire de Gambais │ Pistache │Chocolat</p>
				</div>
			</div>
			<div className="contenantMenu" id="menu-6-temps">
				<div className="contenantImgMenu">
					<img src={plat} alt="" className="imgMenu" />
					<img src={plat} alt="" className="imgMenu" />
				</div>
				<div className="carteMenu">
					<h3 className="nomMenu">Menu Signature.</h3>
					<p className="tarifMenu">
						( 200€ par personne,
						<br />6 bouchées, amuse-bouche, <br />1 entrée, 1 plat, 1 dessert)
					</p>
					<button
						type="button"
						onClick={() => navigate("/reservation")}
						className="menuReservation"
					>
						Réserver dès maintenant
					</button>
				</div>
				<div className="composantMenu">
					<h4>Les Bouchées de L’apéritif</h4>
					<p>6 bouchées selon l’inspiration du chef</p>
					<p>
						<em>
							<strong>( Les entrées )</strong>
						</em>
					</p>
					<h4>L’Amuse-Bouche</h4>
					<p>Surprise du chef</p>
					<h4>La Saint-Jacques</h4>
					<p>Shiso │Saint-Jacques │Vanille</p>
					<h4>Les Ravioles</h4>
					<p>Langoustine │ Foie-gras │Fenouil</p>
					<h4>Le Ceviche</h4>
					<p>Combava │ Daurade │ Tagète</p>
					<p>
						<em>
							<strong>( Les plats )</strong>
						</em>
					</p>
					<h4>Le Poisson</h4>
					<p>Poisson du moment │ Safran │ Champagne</p>
					<h4>La Viande</h4>
					<p>Veau │ Morilles │ Armagnac</p>
					<h4>Le Pigeon</h4>
					<p>Pigeon │ Vanille │ carotte</p>
					<p>
						<em>
							<strong>( Les desserts )</strong>
						</em>
					</p>
					<h4>Le Chocolat</h4>
					<p>Chocolat noir │ Vanille │ Orange</p>
					<h4>La Fusion Dorée</h4>
					<p>Vanille │ Caramel │ Café</p>
					<h4>La Vanille</h4>
					<p>Vanille │ Caramel │ Café</p>
					<h4>Le Sorbet</h4>
					<p>Fruits de saison │ Crumble │ Herbes fines</p>
					<h4>La Poire</h4>
					<p>Poire de Gambais │ Pistache │Chocolat</p>
				</div>
			</div>
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
						<strong>A quel moment dois-je confirmer le menu?</strong>
					</p>
					<p className="reponse">
						Pour une organisation optimale, il est recommandé de confirmer votre
						menu au moins une semaine avant la prestation. Ce délai permet au
						chef Michel Hélène et à son équipe de planifier chaque détail,
						sélectionner les produits les plus frais, et s’assurer de la
						disponibilité des ingrédients souhaités. En confirmant votre choix à
						l’avance, vous donnez également la possibilité au chef de vous
						proposer des alternatives adaptées si un produit n’est pas
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
						Oui. Le chef est à l’écoute de vos envies et peut adapter ses
						propositions en fonction de vos besoins spécifiques. Bien qu’il
						mette en avant ses créations gastronomiques qu’il maîtrise à la
						perfection, il comprend l’importance d’être flexible pour offrir une
						expérience sur mesure à chaque client. Le chef propose généralement
						trois menus différents, chacun comprenant plusieurs choix d’entrées,
						de plats et de desserts. Cela vous permet de composer un repas qui
						correspond à vos goûts, tout en restant dans l’esprit raffiné qui
						caractérise sa cuisine. Si vous avez une allergie alimentaire, une
						intolérance ou une demande particulière, nous vous recommandons de
						nous en informer le plus tôt possible. Ainsi, le chef pourra adapter
						ses recettes, sélectionner les produits appropriés et s’assurer que
						votre repas soit à la fois savoureux et parfaitement sûr.
					</p>
				</div>
				<div>
					<p className="question">
						<strong>Les plats sont-ils préparer sur place?</strong>
					</p>
					<p className="reponse">
						Le chef privilégie une préparation et une cuisson sur place afin de
						garantir fraîcheur, qualité et saveur optimale. Les viandes et
						poissons sont ainsi cuits au dernier moment, pour que vous puissiez
						profiter de textures parfaites et de parfums intenses. Certains
						éléments, comme les jus de viande, les fonds ou certaines sauces,
						nécessitent plusieurs heures de cuisson lente pour développer toute
						leur richesse aromatique. Ces préparations peuvent donc être
						réalisées à l’avance, dans les règles de l’art, afin d’être prêtes à
						sublimer votre repas. En somme, chaque étape est pensée pour vous
						offrir une véritable expérience gastronomique à domicile, où la
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
						utilise des ingrédients frais et de qualité, et peut s’adapter en
						cas d’allergies ou d’intolérances alimentaires. Si vous avez des
						allergies ou des intolérances alimentaires, il est recommandé de
						communiquer cela au chef avant la préparation du repas afin qu’il
						puisse ajuster les ingrédients en conséquence. Le Chef est également
						disponible pour discuter de vos préférences et besoins alimentaires
						pour s’assurer que le repas soit adapté à vos goûts et vos besoins.
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
						indispensable de son maître d’hôtel, garant d’un déroulement fluide
						et élégant du début à la fin Discret et efficace, il veille à ce que
						vous profitiez pleinement de vos convives sans jamais interrompre
						vos échanges ou votre intimité. Son rôle est d’assurer un service
						irréprochable, anticiper vos besoins et veiller à ce que chaque
						détail soit parfait. À la fin du repas, tout est laissé dans un état
						impeccable : la vaisselle est lavée, la machine à laver vidée, la
						cuisine propre et rangée… comme si nous n’étions jamais passés, à
						part pour les souvenirs gourmands laissés à votre table.
					</p>
				</div>
			</div>
		</div>
	);
}

export default Menu;
