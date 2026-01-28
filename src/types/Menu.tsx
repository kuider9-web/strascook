// Types pour les plats individuels
export interface Plat {
	temps?: number;
	nom: string;
	description?: string;
	ingredients: string[];
	vegetalien?: boolean;
	vegetarien?: boolean;
	sans_gluten?: boolean;
	sans_lactose?: boolean;
	image_URL: string;
}

// Type pour le menu à la carte
export interface MenuCarte {
	id: number;
	menu_type: string;
	prix: string;
	entrees: Plat[];
	plats: Plat[];
	desserts: Plat[];
}

// Type pour les menus dégustation (4 ou 5 temps)
export interface MenuDegustation {
	id: number;
	prix: string;
	menu_type: string;
	plats: Plat[];
}

// Union type pour tous les menus
export type Menu = MenuDegustation | MenuCarte;

// Type guard pour vérifier si c'est un menu à la carte
export function isMenuCarte(menu: Menu): menu is MenuCarte {
	return "entrees" in menu && "desserts" in menu;
}
