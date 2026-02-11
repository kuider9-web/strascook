import { useEffect, useState } from "react";
import type { Menu } from "../../utils/localStorage";
import {
	addMenu,
	deleteMenu,
	getMenus,
	updateMenu,
} from "../../utils/localStorage";
import "./MenuManagement.css";

function MenuManagement() {
	const [menus, setMenus] = useState<Menu[]>([]);
	const [formData, setFormData] = useState({
		name: "",
		photo: "",
		price: "",
		allergens: "",
	});
	const [editingId, setEditingId] = useState<number | null>(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadMenus();
	}, []);

	const loadMenus = async () => {
		setLoading(true);
		const data = await getMenus();
		setMenus(data);
		setLoading(false);
	};

	const showSuccess = (message: string) => {
		setSuccessMessage(message);
		setTimeout(() => setSuccessMessage(""), 3000);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (editingId) {
			updateMenu(editingId, { ...formData, price: Number(formData.price) });
			showSuccess("✅ Menu modifié avec succès !");
			setEditingId(null);
		} else {
			addMenu({ ...formData, price: Number(formData.price) });
			showSuccess("✅ Menu ajouté avec succès !");
		}

		setFormData({ name: "", photo: "", price: "", allergens: "" });
		await loadMenus();
	};

	const handleEdit = (menu: Menu) => {
		setFormData({
			name: menu.name,
			photo: menu.photo,
			price: String(menu.price),
			allergens: menu.allergens,
		});
		setEditingId(menu.id);
	};

	const handleDelete = async (id: number) => {
		if (window.confirm("Supprimer ce menu ?")) {
			deleteMenu(id);
			await loadMenus();
			showSuccess("✅ Menu supprimé !");
		}
	};

	if (loading) {
		return <div className="loading">Chargement des menus...</div>;
	}

	return (
		<div className="menu-management">
			<h2> Gestion des Menus</h2>

			{successMessage && (
				<div className="success-message">{successMessage}</div>
			)}

			<form onSubmit={handleSubmit} className="menu-form">
				<div className="form-group">
					<label htmlFor="menu-name">Nom du plat</label>
					<input
						id="menu-name"
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						required
						placeholder="Ex: Risotto aux champignons"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="menu-photo">Photo (URL)</label>
					<input
						id="menu-photo"
						type="url"
						value={formData.photo}
						onChange={(e) =>
							setFormData({ ...formData, photo: e.target.value })
						}
						required
						placeholder="https://exemple.com/photo.jpg"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="menu-price">Prix (€)</label>
					<input
						id="menu-price"
						type="number"
						value={formData.price}
						onChange={(e) =>
							setFormData({ ...formData, price: e.target.value })
						}
						required
						placeholder="25"
						min="0"
						step="0.01"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="menu-allergens">Allergènes</label>
					<input
						id="menu-allergens"
						type="text"
						value={formData.allergens}
						onChange={(e) =>
							setFormData({ ...formData, allergens: e.target.value })
						}
						placeholder="Ex: Gluten, Lactose"
					/>
				</div>

				<button type="submit" className="bo-btn-primary">
					{editingId ? "💾 Modifier le menu" : "➕ Ajouter un nouveau plat"}
				</button>
				{editingId && (
					<button
						type="button"
						className="bo-btn-secondary"
						onClick={() => {
							setEditingId(null);
							setFormData({ name: "", photo: "", price: "", allergens: "" });
						}}
					>
						❌ Annuler
					</button>
				)}
			</form>

			<div className="menu-gallery">
				{menus.length === 0 ? (
					<p className="no-data">Aucun menu pour le moment.</p>
				) : (
					menus.map((menu) => (
						<div key={menu.id} className="menu-card">
							<img src={menu.photo} alt={menu.name} />
							<div className="menu-info">
								<h3>{menu.name}</h3>
								<p className="price">{menu.price} €</p>
								{menu.allergens && (
									<p className="allergens">⚠️ {menu.allergens}</p>
								)}
							</div>
							<div className="menu-actions">
								<button
									type="button"
									className="btn-edit"
									onClick={() => handleEdit(menu)}
								>
									Modifier
								</button>
								<button
									type="button"
									className="btn-delete"
									onClick={() => handleDelete(menu.id)}
								>
									Supprimer
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

export default MenuManagement;
