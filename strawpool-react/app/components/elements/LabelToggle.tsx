import { RadioButton } from "./RadioButton"

export const LabelToggle = (props: {label: string,isActive: boolean,setIsActive: () => void}) => {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm">{props.label}</span>
            <RadioButton isActive={props.isActive} setIsActive={props.setIsActive} />
        </div>
    )
}