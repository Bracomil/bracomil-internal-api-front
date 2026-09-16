import "./css/Home.css"
import AppIcon from "../components/AppIcon"
import BankIcon from "../assets/landscape-placeholder.svg"

import type { IAppIcon } from "../components/AppIcon"

const BankReturns = {
    name: "Retornos de Bancos",
    path: "/bank/returns",
    icon: BankIcon,
}

const RegisteredApps: IAppIcon[] = [BankReturns, BankReturns, BankReturns, BankReturns, BankReturns, BankReturns, BankReturns, BankReturns]

function Home() {


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

export default Home