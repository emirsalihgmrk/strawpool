import React,{ useState } from "react"
import { MenuButton } from "./MenuButton"
import { Icon_Dashboard } from "../icons/Icon_Dashboard";
import { Icon_Theme } from "../icons/Icon_Theme";
import { Icon_Workspace } from "../icons/Icon_Workspace";
import { Icon_Limits } from "../icons/Icon_Limits";
import { Icon_Billing } from "../icons/Icon_Billing";
import { Icon_Settings } from "../icons/Icon_Settings";
import { Icon_HelpCenter } from "../icons/Icon_HelpCenter";
import { Icon_FAQ } from "../icons/Icon_FAQ";
import { Icon_LiveDemo } from "../icons/Icon_LiveDemo";
import { Icon_APIdocs } from "../icons/Icon_APIdocs";
import { Icon_Privacy } from "../icons/Icon_Privacy";

export const Menu = () => {

    const [activeIndex, setActiveIndex] = useState<number>(0);

    const menuItems = [
        { icon: <Icon_Dashboard/>, fieldName: "Dashboard"},
        { icon: <Icon_Theme/>, fieldName: "Themes"},
        { icon: <Icon_Workspace/>, fieldName: "Workspaces"},
        { icon: <Icon_Limits/>, fieldName: "Limits&Usage"},
        { icon: <Icon_Billing/>, fieldName: "Billing"},
        { icon: <Icon_Settings/>, fieldName: "Settings"},
        { icon: <Icon_HelpCenter/>, fieldName: "Help Center"},
        { icon: <Icon_FAQ/>, fieldName: "F.A.Q."},
        { icon: <Icon_LiveDemo/>, fieldName: "Live demo"},
        { icon: <Icon_APIdocs/>, fieldName: "API docs"},
        { icon: <Icon_Privacy/>, fieldName: "Privacy"}
    ]

    return (
        <div className="hidden lg:flex flex-col col-span-2 text-gray-600 gap-y-1">
            {menuItems.map((item, index) => (
                <div key={index}>
                    <MenuButton
                        icon={item.icon}
                        fieldName={item.fieldName}
                        isActive={index === activeIndex}
                        onClick={() => setActiveIndex(index)} />
                    {(index === 5 || index === 10) && <hr className="my-10 border-gray-300" />}
                </div>
            ))}
        </div>
    )
}