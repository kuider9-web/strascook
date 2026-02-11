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

class DataSyncService {
	private static STORAGE_KEYS = {
		MENUS: "strascook_menus",
		RESERVATIONS: "strascook_reservations",
		MENU_MODIFICATIONS: "strascook_menu_modifications",
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
}

export default DataSyncService;
