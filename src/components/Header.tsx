import { Link } from 'react-router-dom';
import './Header.css';
function Header() {
  return (
    <header className="header">
      <Link to="/">Home</Link>
      <Link to="/menu">Menu</Link>
    </header>

    );
}
export default Header;