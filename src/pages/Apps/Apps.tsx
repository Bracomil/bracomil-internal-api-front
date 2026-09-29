import "./Apps.css"
import AppIcon from "../../components/AppIcon"
import { BankReturns } from "../BankReturns/BankReturns"

import type { AppConfig } from "../../components/AppIcon"
import { usePermission } from "../../hooks/usePermission";

import DeniedFolderSVG from "../../assets/folder-no-access-svgrepo-com.svg?react"

function Apps() {
    const { canAny, canAll } = usePermission();
    const RegisteredApps: AppConfig[] = [BankReturns]
    const VisibleApps = RegisteredApps.filter(app => {
        if (app.permissionsNeeded.length === 0) return true;

        const mode = app.permissionsMode ?? 'any';
        return mode === 'any'
            ? canAny(app.permissionsNeeded)
            : canAll(app.permissionsNeeded);
    })
    if (VisibleApps.length === 0) {
        return (
            <div className="no-apps">
                <DeniedFolderSVG id="denied-folder-svg" />
                <p>Você não tem acesso a nenhum aplicativo.</p>
                <p>Entre em contato com o administrador.</p>
            </div>
        );
    }
    return (
        <div className="content">
            <h1>Aplicativos</h1>
            <div className="apps">
                {VisibleApps.map((element) => (
                    <AppIcon key={element.path} {...element} />
                ))}
            </div>
        </div>
    )
}

export default Apps