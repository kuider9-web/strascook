import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { PanierProvider } from "./context/PanierContext";
import Galerie from "./pages/Galerie";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Reservation from "./pages/Reservation";

import "./App.css";

function App() {
	return (
		<PanierProvider>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/menu" element={<Menu />} />
					<Route path="/galerie" element={<Galerie />} />
					<Route path="/reservation" element={<Reservation />} />
				</Routes>
				<Footer />
			</BrowserRouter>
		</PanierProvider>
	);
}

export default App;
