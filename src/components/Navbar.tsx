import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../pages/css/main.css'
import './css/Navbar.css';
import LogoutIcon from "../assets/logout-svgrepo-com.svg?react"

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">

            <div className="navbar-links">
                <Link to="/" className="navbar-logo">MinhaApp</Link>
                <Link to="/">Home</Link>
                <Link to="/dashboard">Home</Link>
            </div>
            {user && <button id="logout" onClick={logout}>
                <p>Sair</p>
                <LogoutIcon id="icon" />

            </button>}
        </nav>
    );
}