import { Link } from "react-router-dom";
import "./Header.css";
function Header() {
return(
    <header className="header">
        <nav className="header__nav">
            <NavLink to="/"className="header__link">
            Accueil
                </NavLink>
                <NavLink to="menu"className="header__link">
            Les Menus>
                </NavLink>
                        <NavLink to="/galerie" className="header__link">
          Galerie
        </NavLink>

        <NavLink to="/reservation" className="header__link">
          Réservations
        </NavLink>
      </nav>
    </header>
  );
}
