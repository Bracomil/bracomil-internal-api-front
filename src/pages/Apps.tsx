import "./css/Apps.css"
import AppIcon from "../components/AppIcon"
import BankReturnIcon from "../assets/vite.svg"
import PlaceholderIcon from "../assets/landscape-placeholder.svg"

import type { IAppIcon } from "../components/AppIcon"

const BankReturns = {
    name: "Retornos de Bancos",
    path: "/apps/bank/returns",
    icon: BankReturnIcon,
}

const PlaceHolder = {
    name: "Lorem Ipsum",
    path: "/lorem/ipsum",
    icon: PlaceholderIcon,
}

const RegisteredApps: IAppIcon[] = [BankReturns, PlaceHolder, PlaceHolder, PlaceHolder, PlaceHolder, PlaceHolder, PlaceHolder, PlaceHolder, PlaceHolder, PlaceHolder, PlaceHolder]

function Apps() {
    return (
        <div className="content">
            <h1>Aplicativos</h1>
            <div className="apps">
                {RegisteredApps.map((element) => (
                    <AppIcon key={element.path} {...element} />
                ))}
            </div>
        </div>
    )
}

export default Apps