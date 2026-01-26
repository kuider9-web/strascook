// import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Galerie from "./pages/Galerie";
import Reservation from "./pages/Reservation";
import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/Menu" element={<Menu />} />
				<Route path="/Galerie" element={<Galerie />} />
				<Route path="/Reservation" element={<Reservation />} />


			</Routes>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
