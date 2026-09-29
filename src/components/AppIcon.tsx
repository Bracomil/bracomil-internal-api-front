
import { Link } from 'react-router-dom';
import type { Permission } from '../types/permissions';
import "./css/AppIcon.css"

export interface AppConfig {
    name: string;
    path: string;
    icon?: string;
    permissionsNeeded: Permission[],
    permissionsMode?: 'any' | 'all';
}

// Componente
interface AppIconProps extends AppConfig {
}

function AppIcon({ name, path, icon }: AppIconProps) {
    return (
        <Link to={path} className="shortcut-button">
            {icon && <img src={icon} alt="" className="shortcut-icon" />}
            <span className="shortcut-name">{name}</span>
        </Link>
    )
}

export default AppIcon;