import { Link } from "react-router"
import { Icon_Filter } from "../icons/Icon_Filter"
import { PollOverview } from "./PollOverview"

export const Polls = () => {
    return (
        <div className="flex flex-col col-span-10 gap-y-5">
            <span className="text-2xl font-medium">Dashboard</span>
            <div className="flex justify-between">
                <Link to="/create">
                    <button className="buttonIndigo">
                        <span className="plus">+</span>
                        Create Poll
                    </button>
                </Link>

                <div className="flex flex-row gap-x-2 items-center">
                    <Icon_Filter />
                    <select className="focus:outline-blue-700 focus:outline-2 border border-gray-300 rounded-md shadow-xs p-2 text-gray-600" name="filter_poll" id="filter_poll">
                        <option value="Created">Created</option>
                        <option value="Participated">Participated</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col gap-y-3">
                <div className="flex gap-x-20">
                    <span className="ms-3 me-auto">Polls</span>
                    <span>Participants</span>
                    <span>Deadline</span>
                    <span className="me-30">Status</span>
                </div>
                <PollOverview />
            </div>
        </div>
    )
}