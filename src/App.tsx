import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Galerie from "./pages/Galerie";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Reservation from "./pages/Reservation";

import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/menu" element={<Menu />} />
				<Route path="/reservation" element={<Reservation />} />
				<Route path="/galerie" element={<Galerie />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
