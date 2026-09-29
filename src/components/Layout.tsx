import { Outlet } from 'react-router-dom';
import { Navbar } from './navbar/Navbar';
import '../pages/css/main.css'
import './css/Layout.css';

export function Layout() {
    return (
        <div className="layout">
            <Navbar />
            <main className="layout-content">
                <Outlet /> {/* 👈 aqui entra a página atual */}
            </main>
        </div>
    );
}