import { createContext, useContext, useEffect, useState } from "react";

interface PanierItem {
	nom: string;
	prix: string;
	image_URL: string;
	quantiter: number;
}

interface PanierContextType {
	panier: PanierItem[];
	ajoutPanier: (produit: Omit<PanierItem, "quantiter">) => void;
	supprimerDuPanier: (nom: string) => void;
	viderPanier: () => void; // ← AJOUTÉ
	totalArticles: number;
	total: number;
}

const PanierContext = createContext<PanierContextType | null>(null);

function PanierProvider({ children }: { children: React.ReactNode }) {
	const [panier, setPanier] = useState<PanierItem[]>(() => {
		const saved = localStorage.getItem("panier");
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem("panier", JSON.stringify(panier));
	}, [panier]);

	function ajoutPanier(produit: Omit<PanierItem, "quantiter">) {
		const produitExistant = panier.find((item) => item.nom === produit.nom);
		if (produitExistant) {
			setPanier(
				panier.map((item) =>
					item.nom === produit.nom
						? { ...item, quantiter: item.quantiter + 1 }
						: item,
				),
			);
		} else {
			setPanier([...panier, { ...produit, quantiter: 1 }]);
		}
	}

	function supprimerDuPanier(nom: string) {
		const produitExistant = panier.find((item) => item.nom === nom);
		if (produitExistant && produitExistant.quantiter > 1) {
			setPanier(
				panier.map((item) =>
					item.nom === nom ? { ...item, quantiter: item.quantiter - 1 } : item,
				),
			);
		} else {
			setPanier(panier.filter((item) => item.nom !== nom));
		}
	}

	// ← FONCTION AJOUTÉE
	function viderPanier() {
		setPanier([]);
	}

	const totalArticles = panier.reduce((acc, item) => acc + item.quantiter, 0);
	const total = panier.reduce(
		(acc, item) => acc + parseFloat(item.prix) * item.quantiter,
		0,
	);

	return (
		<PanierContext.Provider
			value={{
				panier,
				ajoutPanier,
				supprimerDuPanier,
				viderPanier, // ← AJOUTÉ
				totalArticles,
				total,
			}}
		>
			{children}
		</PanierContext.Provider>
	);
}

function usePanier() {
	const context = useContext(PanierContext);
	if (!context)
		throw new Error("usePanier doit être utilisé dans PanierProvider");
	return context;
}

export { PanierProvider, usePanier };
