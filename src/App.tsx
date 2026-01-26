import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/menu" element={<Menu />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
