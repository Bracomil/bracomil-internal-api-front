import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './UserDropdown.css';
import LogoutIcon from "../../assets/logout-svgrepo-com.svg?react"

export function UserDropdown() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Fecha ao clicar fora
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [open]);

    // Fecha ao apertar Esc
    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }

        if (open) {
            document.addEventListener('keydown', handleEsc);
            return () => document.removeEventListener('keydown', handleEsc);
        }
    }, [open]);

    if (!user) return null;

    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="user-dropdown" ref={ref}>
            <button
                type="button"
                className="user-dropdown-trigger"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
            >
                {user.picture ? (
                    <img src={user.picture} alt="" className="user-avatar" />
                ) : (
                    <span className="user-avatar user-avatar-fallback">{initials}</span>
                )}
                <span className="user-name">{user.name}</span>
                <span className={`user-caret ${open ? 'open' : ''}`}>▾</span>
            </button>

            {open && (
                <div className="user-dropdown-menu" role="menu">
                    <div className="user-dropdown-header">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                    </div>

                    <hr className="user-dropdown-divider" />

                    <button
                        type="button"
                        className="user-dropdown-item danger"
                        role="menuitem"
                        onClick={() => {
                            setOpen(false);
                            logout();
                        }}
                    >
                        <LogoutIcon id="icon" />
                        <p>Sair</p>
                    </button>
                </div>
            )}
        </div>
    );
}