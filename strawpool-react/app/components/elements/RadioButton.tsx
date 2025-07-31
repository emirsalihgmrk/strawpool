import { useState } from "react";

export const RadioButton = (props: {isActive: boolean,setIsActive: () => void}) => {
    
    
    return(
        <button type="button" onClick={props.setIsActive}
        className={`relative rounded-full w-[50px] h-[28px] ${props.isActive ? 'bg-indigo-500' : 'bg-gray-200'}
        cursor-pointer focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2`}>

            <span 
            className={`absolute rounded-full w-[23px] h-[23px] bg-white transition-all duration-300
            ${props.isActive ? 'left-[23px]' : 'left-[4px]'} top-1/2 -translate-y-1/2`}></span>
        </button>
    )
}