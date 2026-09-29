import './Navbar.css';
import logo from "../../assets/logo-BRACOMIL-512x512-1-150x150.png"
import { NavLink } from 'react-router-dom';
import { UserDropdown } from '../UserDropdown/UserDropdown';

export function Navbar() {
    return (
        <nav className="navbar">
            <img src={logo} id='logo' alt="company logo"></img>
            <div className='vertical-hr' />
            <div className="navbar-links">
                <NavLink to="/" end className="nav-link">Aplicativos</NavLink>
            </div>

            <div className="navbar-user" id="settings">
                <UserDropdown />   {/* 👈 substitui o botão de sair */}
            </div>
        </nav>
    );
}