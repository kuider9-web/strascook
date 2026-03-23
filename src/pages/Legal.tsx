import { useParams, Link } from "react-router-dom";
import "./Legal.css";

const PAGES = {
	cgv: {
		title: "Conditions Générales de Vente",
		sections: [
			{
				heading: "1. Objet",
				text: "Les présentes conditions générales de vente régissent les relations contractuelles entre Strascook (ci-après « le Prestataire ») et tout client souhaitant bénéficier de ses services de chef privé gastronomique.",
			},
			{
				heading: "2. Prestations",
				text: "Le Prestataire propose des services de chef à domicile pour des événements privés ou professionnels : dîners, mariages, anniversaires, séminaires, etc. Chaque prestation est établie sur mesure après échange avec le client.",
			},
			{
				heading: "3. Tarifs",
				text: "Les tarifs sont communiqués sur devis. Ils incluent la préparation, la cuisson sur place et le service en salle avec maître d'hôtel. Les frais de déplacement peuvent s'ajouter selon la distance.",
			},
			{
				heading: "4. Réservation & Acompte",
				text: "Toute réservation est confirmée à réception d'un acompte de 30 % du montant total. Le solde est réglé au plus tard le jour de la prestation.",
			},
			{
				heading: "5. Annulation",
				text: "Toute annulation doit être notifiée par écrit. En cas d'annulation moins de 72h avant la prestation, l'acompte reste acquis au Prestataire.",
			},
			{
				heading: "6. Responsabilité",
				text: "Le Prestataire est couvert par une assurance responsabilité civile professionnelle. Sa responsabilité ne saurait être engagée en cas de force majeure ou d'information erronée fournie par le client.",
			},
			{
				heading: "7. Données personnelles",
				text: "Les données collectées lors de la réservation sont utilisées uniquement dans le cadre de la prestation et ne sont pas transmises à des tiers. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression.",
			},
		],
	},
	mentions: {
		title: "Mentions Légales",
		sections: [
			{
				heading: "Éditeur du site",
				text: "Strascook — Chef Privé Gastronomique\nResponsable de publication : Strascook\nEmail : gastronomique@gmail.com\nTéléphone : 06 58 60 39 19",
			},
			{
				heading: "Hébergement",
				text: "Ce site est hébergé par un prestataire tiers. Pour toute question relative à l'hébergement, contactez-nous par email.",
			},
			{
				heading: "Propriété intellectuelle",
				text: "L'ensemble du contenu de ce site (textes, images, vidéos) est protégé par le droit d'auteur. Toute reproduction sans autorisation écrite est interdite.",
			},
			{
				heading: "Cookies",
				text: "Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement (panier, authentification). Aucun cookie de traçage publicitaire n'est déposé.",
			},
			{
				heading: "Droit applicable",
				text: "Le présent site est soumis au droit français. Tout litige sera soumis aux tribunaux compétents du ressort de Strasbourg.",
			},
		],
	},
	siret: {
		title: "Informations Légales",
		sections: [
			{
				heading: "Identification de l'entreprise",
				text: "Raison sociale : Strascook\nForme juridique : Auto-entrepreneur\nActivité : Services de chef privé gastronomique à domicile",
			},
			{
				heading: "Numéro SIRET",
				text: "Numéro SIRET : [En cours d'enregistrement]\nCode APE : 5621Z — Traiteurs",
			},
			{
				heading: "Contact",
				text: "Email : gastronomique@gmail.com\nTéléphone : 06 58 60 39 19\nZone d'intervention : Strasbourg et environs (Bas-Rhin, 67)",
			},
		],
	},
};

type PageKey = keyof typeof PAGES;

function Legal() {
	const { page } = useParams<{ page: PageKey }>();
	const data = page && PAGES[page as PageKey];

	if (!data) {
		return (
			<div className="legal-page">
				<div className="legal-content">
					<h1>Page introuvable</h1>
					<Link to="/" className="legal-back">← Retour à l'accueil</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="legal-page">
			<div className="legal-content">
				<Link to="/" className="legal-back">← Retour à l'accueil</Link>
				<h1 className="legal-title">{data.title}</h1>
				<div className="legal-nav">
					<Link to="/legal/cgv" className={page === "cgv" ? "active" : ""}>CGV</Link>
					<Link to="/legal/mentions" className={page === "mentions" ? "active" : ""}>Mentions légales</Link>
					<Link to="/legal/siret" className={page === "siret" ? "active" : ""}>SIRET</Link>
				</div>
				{data.sections.map((s) => (
					<div key={s.heading} className="legal-section">
						<h2>{s.heading}</h2>
						<p style={{ whiteSpace: "pre-line" }}>{s.text}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default Legal;
