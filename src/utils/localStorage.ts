// Interfaces
export interface Menu {
	id: number;
	name: string;
	photo: string;
	price: number;
	allergens: string;
}

export interface Reservation {
	id: number;
	clientName: string;
	date: string;
	time: string;
	guests: number;
	status: "pending" | "accepted" | "refused";
}

// Interface pour l'API Strascook
export interface ApiDish {
	temps?: number;
	categorie: "entree" | "plat" | "dessert";
	nom: string;
	description?: string;
	ingredients: string[];
	vegetalien: boolean;
	vegetarien: boolean;
	sans_gluten: boolean;
	sans_lactose: boolean;
	image_URL: string;
	prix?: string;
}

export interface ApiMenu {
	id: number;
	menu_type: string;
	prix?: string;
	entrees: ApiDish[];
	plats: ApiDish[];
	desserts: ApiDish[];
}

// Clés localStorage
const KEYS = {
	MENUS: "strascook_menus",
	MENUS_EDITS: "strascook_menus_edits",
	RESERVATIONS: "strascook_reservations",
	BLOCKED_DATES: "strascook_blocked_dates",
};

// Récupérer plats de l'API
export const fetchApiDishes = async (): Promise<ApiDish[]> => {
	try {
		const response = await fetch("https://api-strascook.vercel.app/items");
		if (!response.ok) throw new Error("Erreur API");

		const data: ApiMenu[] = await response.json();
		const dishes: ApiDish[] = [];
		for (const menu of data) {
			dishes.push(...menu.entrees, ...menu.plats, ...menu.desserts);
		}
		return dishes;
	} catch (error) {
		console.error("Erreur API:", error);
		return [];
	}
};

// Convertir ApiDish → Menu
export const convertApiDishToMenu = (dish: ApiDish, index: number): Menu => {
	const allergens = [];
	if (!dish.sans_gluten) allergens.push("Gluten");
	if (!dish.sans_lactose) allergens.push("Lactose");

	return {
		id: index,
		name: dish.nom,
		photo: dish.image_URL,
		price: dish.prix
			? parseFloat(dish.prix.replace(/[^\d,]/g, "").replace(",", "."))
			: 0,
		allergens: allergens.join(", "),
	};
};

// Récupérer tous les menus (API + local)
export const getMenus = async (): Promise<Menu[]> => {
	const apiDishes = await fetchApiDishes();
	const menusFromApi = apiDishes.map((dish, index) =>
		convertApiDishToMenu(dish, index),
	);

	const localData = localStorage.getItem(KEYS.MENUS);
	const localMenus: Menu[] = localData ? JSON.parse(localData) : [];

	return [...menusFromApi, ...localMenus];
};

// Ajouter menu local
export const addMenu = (menu: Omit<Menu, "id">): Menu => {
	const localData = localStorage.getItem(KEYS.MENUS);
	const localMenus: Menu[] = localData ? JSON.parse(localData) : [];

	const newMenu = { ...menu, id: Date.now() };
	localMenus.push(newMenu);
	localStorage.setItem(KEYS.MENUS, JSON.stringify(localMenus));
	return newMenu;
};

// Modifier menu
export const updateMenu = (
	id: number,
	updatedMenu: Partial<Omit<Menu, "id">>,
): void => {
	const localData = localStorage.getItem(KEYS.MENUS);
	const localMenus: Menu[] = localData ? JSON.parse(localData) : [];
	const index = localMenus.findIndex((m) => m.id === id);

	if (index !== -1) {
		localMenus[index] = { ...localMenus[index], ...updatedMenu };
		localStorage.setItem(KEYS.MENUS, JSON.stringify(localMenus));
	}
};

// Supprimer menu
export const deleteMenu = (id: number): void => {
	const localData = localStorage.getItem(KEYS.MENUS);
	const localMenus: Menu[] = localData ? JSON.parse(localData) : [];
	const filtered = localMenus.filter((m) => m.id !== id);
	localStorage.setItem(KEYS.MENUS, JSON.stringify(filtered));
};

// RÉSERVATIONS
export const getReservations = (): Reservation[] => {
	const data = localStorage.getItem(KEYS.RESERVATIONS);
	return data ? JSON.parse(data) : [];
};

export const updateReservationStatus = (
	id: number,
	status: "pending" | "accepted" | "refused",
): void => {
	const reservations = getReservations();
	const index = reservations.findIndex((r) => r.id === id);
	if (index !== -1) {
		reservations[index].status = status;
		localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(reservations));
	}
};

// DATES BLOQUÉES
export const getBlockedDates = (): string[] => {
	const data = localStorage.getItem(KEYS.BLOCKED_DATES);
	return data ? JSON.parse(data) : [];
};

export const toggleBlockedDate = (date: string): string[] => {
	const blockedDates = getBlockedDates();
	const index = blockedDates.indexOf(date);

	if (index !== -1) {
		blockedDates.splice(index, 1);
	} else {
		blockedDates.push(date);
	}

	localStorage.setItem(KEYS.BLOCKED_DATES, JSON.stringify(blockedDates));
	return blockedDates;
};
