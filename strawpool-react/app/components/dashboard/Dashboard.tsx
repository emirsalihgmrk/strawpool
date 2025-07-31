import { Menu } from "../menu/Menu"
import { Polls } from "../polls/Polls"

export default function Dashboard(){
    
    return(
        <div className="flex-1 grid grid-cols-12 bg-gray-50 gap-x-10 py-6 px-30">
            <Menu/>
            <Polls/>
        </div>
    )
}