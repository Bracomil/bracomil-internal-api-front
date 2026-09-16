
import { Link } from 'react-router-dom';
import "./css/AppIcon.css"

export interface IAppIcon {
    name: string;
    path: string;
    icon?: string;
}

// Componente
interface AppIconProps extends IAppIcon {
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