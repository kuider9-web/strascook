// context/AuthContext.tsx
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

interface User {
	id: string;
	email: string;
	name: string;
	role: "admin" | "chef";
}

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Au chargement, vérifie si un utilisateur est déjà connecté
	useEffect(() => {
		const storedUser = localStorage.getItem("strascook_user");
		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (error) {
				console.error("Error parsing stored user:", error);
				localStorage.removeItem("strascook_user");
			}
		}
		setIsLoading(false);
	}, []);

	const login = async (email: string, password: string): Promise<boolean> => {
		// Pour ton projet école, tu peux hardcoder les credentials
		// En production, ce serait un appel API sécurisé
		const adminCredentials = {
			email: "admin@strascook.fr",
			password: "admin123", // À CHANGER évidemment !
		};

		const chefCredentials = {
			email: "chef@strascook.fr",
			password: "chef123",
		};

		// Simule un délai réseau
		await new Promise((resolve) => setTimeout(resolve, 500));

		let authenticatedUser: User | null = null;

		if (
			email === adminCredentials.email &&
			password === adminCredentials.password
		) {
			authenticatedUser = {
				id: "admin_1",
				email: "admin@strascook.fr",
				name: "Admin Strascook",
				role: "admin",
			};
		} else if (
			email === chefCredentials.email &&
			password === chefCredentials.password
		) {
			authenticatedUser = {
				id: "chef_1",
				email: "chef@strascook.fr",
				name: "Chef Cuisinier",
				role: "chef",
			};
		}

		if (authenticatedUser) {
			setUser(authenticatedUser);
			localStorage.setItem("strascook_user", JSON.stringify(authenticatedUser));
			return true;
		}

		return false;
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("strascook_user");
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				login,
				logout,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

// Hook personnalisé pour utiliser le contexte facilement
export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
