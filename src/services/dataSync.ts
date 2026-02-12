// src/services/dataSync.ts

export interface Menu {
	id: string;
	nom: string;
	prix: number;
	description: string;
	image_URL: string;
	categorie?: string;
	quantiter?: number; // Pour le panier
}

export interface Reservation {
	id: string;
	clientName: string;
	clientEmail: string;
	clientPhone: string;
	date: string; // Format ISO: "2025-02-15"
	time: string; // Format: "19:30"
	guests: number;
	menus: Menu[]; // Les menus sélectionnés depuis le panier
	status: "pending" | "confirmed" | "cancelled";
	totalPrice: number;
	createdAt: string;
	notes?: string;
}

export interface MenuModification {
	id: string;
	originalId: string; // ID du menu de l'API Vercel
	modifications: Partial<Menu>;
	modifiedAt: string;
}

export interface Plat {
	id: string;
	temps?: number;
	categorie: "entree" | "plat" | "dessert";
	nom: string;
	prix: string;
	description?: string;
	ingredients?: string[];
	vegetalien: boolean;
	vegetarien: boolean;
	sans_gluten: boolean;
	sans_lactose: boolean;
	image_URL: string;
	isCustom?: boolean; // Créé par le chef (vs venant de l'API)
}

export interface MenuFilters {
	vegetarien: boolean;
	vegetalien: boolean;
	sans_gluten: boolean;
	sans_lactose: boolean;
	entrees: boolean;
	plats: boolean;
	desserts: boolean;
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explication optionnelle>
class DataSyncService {
	private static STORAGE_KEYS = {
		MENUS: "strascook_menus",
		RESERVATIONS: "strascook_reservations",
		MENU_MODIFICATIONS: "strascook_menu_modifications",
		MENU_FILTERS: "strascook_menu_filters",
		CUSTOM_PLATS: "strascook_custom_plats",
		HIDDEN_PLATS: "strascook_hidden_plats",
	};

	// ========================================
	// GESTION DES MENUS
	// ========================================

	/**
	 * Récupère les menus en fusionnant l'API Vercel avec les modifications locales
	 */
	static async getMenus(): Promise<Menu[]> {
		try {
			// 1. Récupère les menus de base depuis l'API Vercel
			const response = await fetch(
				"https://strascook-api.vercel.app/api/menus",
			);
			const apiMenus: Menu[] = await response.json();

			// 2. Récupère les modifications depuis localStorage
			const modifications = DataSyncService.getLocalData<MenuModification[]>(
				DataSyncService.STORAGE_KEYS.MENU_MODIFICATIONS,
			);

			// 3. Fusionne les données
			if (!modifications || modifications.length === 0) {
				return apiMenus;
			}

			return DataSyncService.mergeMenus(apiMenus, modifications);
		} catch (error) {
			console.error("Erreur lors de la récupération des menus:", error);
			// Fallback sur les menus locaux uniquement
			return (
				DataSyncService.getLocalData<Menu[]>(
					DataSyncService.STORAGE_KEYS.MENUS,
				) || []
			);
		}
	}

	/**
	 * Sauvegarde une modification de menu
	 */
	static saveMenuModification(menu: Menu): void {
		const modifications =
			DataSyncService.getLocalData<MenuModification[]>(
				DataSyncService.STORAGE_KEYS.MENU_MODIFICATIONS,
			) || [];

		const modification: MenuModification = {
			id: `mod_${Date.now()}`,
			originalId: menu.id,
			modifications: menu,
			modifiedAt: new Date().toISOString(),
		};

		const existingIndex = modifications.findIndex(
			(m) => m.originalId === menu.id,
		);

		if (existingIndex >= 0) {
			modifications[existingIndex] = modification;
		} else {
			modifications.push(modification);
		}

		DataSyncService.setLocalData(
			DataSyncService.STORAGE_KEYS.MENU_MODIFICATIONS,
			modifications,
		);

		// Déclenche un événement pour notifier les autres composants
		window.dispatchEvent(
			new CustomEvent("menusUpdated", { detail: modifications }),
		);
	}

	/**
	 * Supprime une modification de menu (retour à l'original de l'API)
	 */
	static deleteMenuModification(menuId: string): void {
		const modifications =
			DataSyncService.getLocalData<MenuModification[]>(
				DataSyncService.STORAGE_KEYS.MENU_MODIFICATIONS,
			) || [];
		const filtered = modifications.filter((m) => m.originalId !== menuId);

		DataSyncService.setLocalData(
			DataSyncService.STORAGE_KEYS.MENU_MODIFICATIONS,
			filtered,
		);
		window.dispatchEvent(new CustomEvent("menusUpdated", { detail: filtered }));
	}

	// ========================================
	// GESTION DES RÉSERVATIONS
	// ========================================

	/**
	 * Récupère toutes les réservations
	 */
	static getReservations(): Reservation[] {
		return (
			DataSyncService.getLocalData<Reservation[]>(
				DataSyncService.STORAGE_KEYS.RESERVATIONS,
			) || []
		);
	}

	/**
	 * Récupère les réservations filtrées par statut
	 */
	static getReservationsByStatus(status: Reservation["status"]): Reservation[] {
		const reservations = DataSyncService.getReservations();
		return reservations.filter((r) => r.status === status);
	}

	/**
	 * Récupère les réservations pour une date donnée
	 */
	static getReservationsByDate(date: string): Reservation[] {
		const reservations = DataSyncService.getReservations();
		return reservations.filter((r) => r.date === date);
	}

	/**
	 * Ajoute une nouvelle réservation (depuis l'espace client)
	 */
	static addReservation(
		reservation: Omit<Reservation, "id" | "createdAt" | "status">,
	): Reservation {
		const reservations = DataSyncService.getReservations();

		const newReservation: Reservation = {
			...reservation,
			id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			status: "pending",
			createdAt: new Date().toISOString(),
		};

		reservations.push(newReservation);
		DataSyncService.setLocalData(
			DataSyncService.STORAGE_KEYS.RESERVATIONS,
			reservations,
		);

		// Notifie le back-office
		window.dispatchEvent(
			new CustomEvent("reservationsUpdated", { detail: reservations }),
		);

		return newReservation;
	}

	/**
	 * Met à jour le statut d'une réservation (depuis le back-office)
	 */
	static updateReservationStatus(
		id: string,
		status: Reservation["status"],
	): void {
		const reservations = DataSyncService.getReservations();
		const reservation = reservations.find((r) => r.id === id);

		if (reservation) {
			reservation.status = status;
			DataSyncService.setLocalData(
				DataSyncService.STORAGE_KEYS.RESERVATIONS,
				reservations,
			);
			window.dispatchEvent(
				new CustomEvent("reservationsUpdated", { detail: reservations }),
			);
		}
	}

	/**
	 * Supprime une réservation
	 */
	static deleteReservation(id: string): void {
		const reservations = DataSyncService.getReservations();
		const filtered = reservations.filter((r) => r.id !== id);

		DataSyncService.setLocalData(
			DataSyncService.STORAGE_KEYS.RESERVATIONS,
			filtered,
		);
		window.dispatchEvent(
			new CustomEvent("reservationsUpdated", { detail: filtered }),
		);
	}

	// ========================================
	// GESTION DES PLATS PERSONNALISÉS
	// ========================================

	/**
	 * Récupère tous les plats personnalisés créés par le chef
	 */
	static getCustomPlats(): Plat[] {
		return (
			DataSyncService.getLocalData<Plat[]>(
				DataSyncService.STORAGE_KEYS.CUSTOM_PLATS,
			) || []
		);
	}

	/**
	 * Ajoute un nouveau plat personnalisé
	 */
	static addCustomPlat(plat: Omit<Plat, "id" | "isCustom">): Plat {
		const customPlats = DataSyncService.getCustomPlats();

		const newPlat: Plat = {
			...plat,
			id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			isCustom: true,
		};

		customPlats.push(newPlat);
		DataSyncService.setLocalData(
			DataSyncService.STORAGE_KEYS.CUSTOM_PLATS,
			customPlats,
		);

		window.dispatchEvent(
			new CustomEvent("platsUpdated", { detail: customPlats }),
		);

		return newPlat;
	}

	/**
	 * Met à jour un plat personnalisé existant
	 */
	static updateCustomPlat(id: string, updates: Partial<Plat>): void {
		const customPlats = DataSyncService.getCustomPlats();
		const index = customPlats.findIndex((p) => p.id === id);

		if (index >= 0) {
			customPlats[index] = { ...customPlats[index], ...updates };
			DataSyncService.setLocalData(
				DataSyncService.STORAGE_KEYS.CUSTOM_PLATS,
				customPlats,
			);
			window.dispatchEvent(
				new CustomEvent("platsUpdated", { detail: customPlats }),
			);
		}
	}

	/**
	 * Supprime un plat personnalisé
	 */
	static deleteCustomPlat(id: string): void {
		const customPlats = DataSyncService.getCustomPlats();
		const filtered = customPlats.filter((p) => p.id !== id);

		DataSyncService.setLocalData(
			DataSyncService.STORAGE_KEYS.CUSTOM_PLATS,
			filtered,
		);
		window.dispatchEvent(new CustomEvent("platsUpdated", { detail: filtered }));
	}

	/**
	 * Récupère les IDs des plats cachés (masqués par le chef)
	 */
	static getHiddenPlats(): string[] {
		return (
			DataSyncService.getLocalData<string[]>(
				DataSyncService.STORAGE_KEYS.HIDDEN_PLATS,
			) || []
		);
	}

	/**
	 * Masque un plat de l'API
	 */
	static hidePlat(platId: string): void {
		const hiddenPlats = DataSyncService.getHiddenPlats();

		if (!hiddenPlats.includes(platId)) {
			hiddenPlats.push(platId);
			DataSyncService.setLocalData(
				DataSyncService.STORAGE_KEYS.HIDDEN_PLATS,
				hiddenPlats,
			);
			window.dispatchEvent(new CustomEvent("platsUpdated"));
		}
	}

	/**
	 * Affiche à nouveau un plat masqué
	 */
	static showPlat(platId: string): void {
		const hiddenPlats = DataSyncService.getHiddenPlats();
		const filtered = hiddenPlats.filter((id) => id !== platId);

		DataSyncService.setLocalData(
			DataSyncService.STORAGE_KEYS.HIDDEN_PLATS,
			filtered,
		);
		window.dispatchEvent(new CustomEvent("platsUpdated"));
	}

	// ========================================
	// GESTION DES FILTRES DE MENUS
	// ========================================

	/**
	 * Récupère les filtres de menus définis par le chef
	 */
	static getMenuFilters(): MenuFilters {
		const filters = DataSyncService.getLocalData<MenuFilters>(
			DataSyncService.STORAGE_KEYS.MENU_FILTERS,
		);

		// Valeurs par défaut : tout affiché
		return (
			filters || {
				vegetarien: true,
				vegetalien: true,
				sans_gluten: true,
				sans_lactose: true,
				entrees: true,
				plats: true,
				desserts: true,
			}
		);
	}

	/**
	 * Sauvegarde les filtres de menus
	 */
	static saveMenuFilters(filters: MenuFilters): void {
		DataSyncService.setLocalData(
			DataSyncService.STORAGE_KEYS.MENU_FILTERS,
			filters,
		);
		window.dispatchEvent(
			new CustomEvent("menuFiltersUpdated", { detail: filters }),
		);
	}

	// ========================================
	// MÉTHODES UTILITAIRES PRIVÉES
	// ========================================

	private static getLocalData<T>(key: string): T | null {
		try {
			const data = localStorage.getItem(key);
			return data ? JSON.parse(data) : null;
		} catch (error) {
			console.error(`Erreur lecture ${key} depuis localStorage:`, error);
			return null;
		}
	}

	private static setLocalData<T>(key: string, data: T): void {
		try {
			localStorage.setItem(key, JSON.stringify(data));
		} catch (error) {
			console.error(`Erreur sauvegarde ${key} dans localStorage:`, error);
		}
	}

	private static mergeMenus(
		apiMenus: Menu[],
		modifications: MenuModification[],
	): Menu[] {
		const modMap = new Map(
			modifications.map((m) => [m.originalId, m.modifications]),
		);

		return apiMenus.map((menu) => {
			const mod = modMap.get(menu.id);
			return mod ? { ...menu, ...mod } : menu;
		});
	}
	// ========================================
	// GESTION DES DISPONIBILITÉS / DATES BLOQUÉES
	// ========================================

	/**
	 * Récupère les dates bloquées manuellement par le chef
	 */
	static getBlockedDates(): string[] {
		return (
			DataSyncService.getLocalData<string[]>("strascook_blocked_dates") || []
		);
	}

	/**
	 * Bloque/débloque une date
	 */
	static toggleBlockedDate(dateStr: string): string[] {
		const blocked = DataSyncService.getBlockedDates();

		if (blocked.includes(dateStr)) {
			// Débloque
			const filtered = blocked.filter((d) => d !== dateStr);
			DataSyncService.setLocalData("strascook_blocked_dates", filtered);
			window.dispatchEvent(
				new CustomEvent("datesUpdated", { detail: filtered }),
			);
			return filtered;
		} else {
			// Bloque
			blocked.push(dateStr);
			DataSyncService.setLocalData("strascook_blocked_dates", blocked);
			window.dispatchEvent(
				new CustomEvent("datesUpdated", { detail: blocked }),
			);
			return blocked;
		}
	}

	/**
	 * Récupère toutes les dates indisponibles (bloquées + réservées confirmées)
	 * Format: "2025-02-15" (journée entière) ou "2025-02-15-AM" ou "2025-02-15-PM"
	 */
	static getUnavailableDates(): string[] {
		// 1. Dates bloquées manuellement (journée entière)
		const blocked = DataSyncService.getBlockedDates();

		// 2. Dates avec réservation confirmée (par demi-journée)
		const reservations = DataSyncService.getReservations();
		const reservedSlots = reservations
			.filter((r) => r.status === "confirmed")
			.map((r) => {
				// Si l'heure est avant 14h → matin (AM), sinon après-midi (PM)
				const hour = parseInt(r.time.split(":")[0], 10);
				const period = hour < 14 ? "AM" : "PM";
				return `${r.date}-${period}`;
			});

		// 3. Fusionne et déduplique
		return [...new Set([...blocked, ...reservedSlots])];
	}
}

export default DataSyncService;
