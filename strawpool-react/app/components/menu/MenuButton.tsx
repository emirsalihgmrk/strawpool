import { Link } from "react-router"

export const MenuButton = (props: 
    {   icon: React.ReactNode,
        fieldName: string,
        isActive: boolean,
        onClick: () => void}) => {

    return(
        <Link to="#" className={`flex flex-row items-center gap-x-2 p-2 rounded-lg w-full text-sm text-gray-600 font-medium
                        ${props.isActive ? ' bg-gray-200' : ''} ${props.fieldName !== 'Dashboard' ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={props.onClick}>
            {props.icon}
            <span className="flex-1 text-start text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer">{props.fieldName}</span>
        </Link>
    )
}