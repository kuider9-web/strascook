import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { PanierProvider } from "./context/PanierContext";
import BackOffice from "./pages/BackOffice/BackOffice";
import Galerie from "./pages/Galerie";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Reservation from "./pages/Reservation";

function App() {
	return (
		<AuthProvider>
			<PanierProvider>
				<BrowserRouter>
					<Header />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/menu" element={<Menu />} />
						<Route path="/galerie" element={<Galerie />} />
						<Route path="/reservation" element={<Reservation />} />
						<Route path="/login" element={<Login />} />
						<Route
							path="/admin"
							element={
								<ProtectedRoute>
									<BackOffice />
								</ProtectedRoute>
							}
						/>
					</Routes>
					<Footer />
				</BrowserRouter>
			</PanierProvider>
		</AuthProvider>
	);
}

export default App;
