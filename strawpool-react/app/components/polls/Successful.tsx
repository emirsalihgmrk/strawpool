import { Link } from "react-router";
import { Icon_Cancel } from "../icons/Icon_Cancel";
import { Icon_Limits } from "../icons/Icon_Limits";
import { Icon_Share } from "../icons/Icon_Share";
import { Icon_Tick } from "../icons/Icon_Tick";
import type { PollDto } from "~/dto/PollDto";

export const Successful = (props: {onClose: () => void,poll: PollDto | null}) => {
    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
                <div className="relative flex flex-col items-center bg-white gap-y-3 p-5 rounded-md">
                    <span className="bg-green-200 rounded-full h-10 w-10 flex items-center justify-center">
                        <Icon_Tick/>
                    </span>
                    <span className="text-lg">Vote succesful</span>
                    <span className="text-gray-500 text-sm">Thank you for participating in this poll. Your vote has been counted.</span>
                    <div className="flex justify-center gap-x-5 w-full">
                        <Link to={`/poll/${props.poll?.id}/results`} className="buttonIndigo gap-x-0 w-full flex justify-center">
                            <Icon_Limits/>Results
                        </Link>
                        <button className="input flex w-full justify-center cursor-pointer">
                            <Icon_Share/>Share
                        </button>
                    </div>
                    <button 
                    className="absolute top-2 right-2 text-gray-600 input border-none cursor-pointer p-0"
                    onClick={() => props.onClose()}>
                        <Icon_Cancel/>
                    </button>
                </div>
        </div>
    );
}