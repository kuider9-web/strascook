import { useEffect, useState } from "react";
import "./Galerie.css";

interface GalleryImage {
	id: number;
	url: string;
	title: string;
	category: "plats" | "restaurant" | "ambiance" | "equipe";
	alt: string;
}

// Images de la galerie - À remplacer par vos propres URLs Imgur
const galleryImages: GalleryImage[] = [
	// Catégorie Plats
	{
		id: 1,
		url: "https://i.imgur.com/placeholder1.jpg",
		title: "Foie gras poêlé",
		category: "plats",
		alt: "Foie gras poêlé avec chutney de figues",
	},
	{
		id: 2,
		url: "https://i.imgur.com/placeholder2.jpg",
		title: "Saint-Jacques rôties",
		category: "plats",
		alt: "Saint-Jacques rôties sur lit de purée de céleri",
	},
	{
		id: 3,
		url: "https://i.imgur.com/placeholder3.jpg",
		title: "Filet de bœuf",
		category: "plats",
		alt: "Filet de bœuf rossini avec sauce aux morilles",
	},
	{
		id: 4,
		url: "https://i.imgur.com/placeholder4.jpg",
		title: "Dessert signature",
		category: "plats",
		alt: "Sphère chocolat avec cœur coulant",
	},

	// Catégorie Restaurant
	{
		id: 5,
		url: "https://i.imgur.com/placeholder5.jpg",
		title: "Salle principale",
		category: "restaurant",
		alt: "Vue de la salle de restaurant avec tables dressées",
	},
	{
		id: 6,
		url: "https://i.imgur.com/placeholder6.jpg",
		title: "Cuisine ouverte",
		category: "restaurant",
		alt: "Cuisine professionnelle visible depuis la salle",
	},

	// Catégorie Ambiance
	{
		id: 7,
		url: "https://i.imgur.com/placeholder7.jpg",
		title: "Ambiance nocturne",
		category: "ambiance",
		alt: "Restaurant illuminé en soirée",
	},
	{
		id: 8,
		url: "https://i.imgur.com/placeholder8.jpg",
		title: "Terrasse",
		category: "ambiance",
		alt: "Terrasse extérieure du restaurant",
	},

	// Catégorie Équipe
	{
		id: 9,
		url: "https://i.imgur.com/placeholder9.jpg",
		title: "Chef et brigade",
		category: "equipe",
		alt: "Le chef et son équipe en cuisine",
	},
];

const Galerie = () => {
	const [selectedCategory, setSelectedCategory] = useState<
		"all" | GalleryImage["category"]
	>("all");
	const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

	// Filtrer les images selon la catégorie sélectionnée
	const filteredImages =
		selectedCategory === "all"
			? galleryImages
			: galleryImages.filter((img) => img.category === selectedCategory);

	const categoryLabels = {
		all: "Tout",
		plats: "Nos Plats",
		restaurant: "Le Restaurant",
		ambiance: "Ambiance",
		equipe: "Notre Équipe",
	};

	// Gérer la fermeture du modal avec la touche Escape
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && selectedImage) {
				setSelectedImage(null);
			}
		};

		if (selectedImage) {
			document.addEventListener("keydown", handleEscape);
			// Empêcher le scroll du body quand le modal est ouvert
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [selectedImage]);

	return (
		<div className="galerie-container">
			<header className="galerie-header">
				<h1>Galerie</h1>
				<p className="galerie-subtitle">
					Découvrez l'univers visuel de StrassCook à travers nos créations
					culinaires et notre cadre raffiné
				</p>
			</header>

			{/* Filtres de catégories */}
			<nav className="galerie-filters">
				{(
					Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>
				).map((category) => (
					<button
						key={category}
						className={`filter-button ${selectedCategory === category ? "active" : ""}`}
						onClick={() => setSelectedCategory(category)}
						type="button"
					>
						{categoryLabels[category]}
					</button>
				))}
			</nav>

			{/* Grille d'images */}
			<div className="galerie-grid">
				{filteredImages.map((image) => (
					<button
						key={image.id}
						className="galerie-item"
						onClick={() => setSelectedImage(image)}
						type="button"
						aria-label={`Voir ${image.title} en grand`}
					>
						<img src={image.url} alt={image.alt} loading="lazy" />
						<div className="galerie-overlay">
							<h3>{image.title}</h3>
						</div>
					</button>
				))}
			</div>

			{/* Modal pour afficher l'image en grand */}
			{selectedImage && (
				<div
					className="galerie-modal"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-title"
				>
					{/* Overlay cliquable pour fermer */}
					<button
						className="modal-overlay"
						onClick={() => setSelectedImage(null)}
						type="button"
						aria-label="Fermer la galerie"
					/>

					<div className="modal-content">
						<button
							className="modal-close"
							onClick={() => setSelectedImage(null)}
							type="button"
							aria-label="Fermer"
						>
							×
						</button>
						<img src={selectedImage.url} alt={selectedImage.alt} />
						<div className="modal-info">
							<h2 id="modal-title">{selectedImage.title}</h2>
							<p className="modal-category">
								{categoryLabels[selectedImage.category]}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Message si aucune image */}
			{filteredImages.length === 0 && (
				<div className="galerie-empty">
					<p>Aucune image disponible dans cette catégorie.</p>
				</div>
			)}
		</div>
	);
};

export default Galerie;
