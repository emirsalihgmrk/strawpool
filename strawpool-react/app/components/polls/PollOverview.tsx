import { useEffect, useState } from "react";
import { Icon_Ellipsis } from "../icons/Icon_Ellipsis";
import { Icon_LivePoll } from "../icons/Icon_LivePoll";
import { useAuth } from "~/auth/AuthContext";
import { getAll } from "~/api/ApiPoll";
import type { PollDto } from "~/dto/PollDto";
import type { OptionDto } from "~/dto/OptionDto";
import { Link } from "react-router";

export const PollOverview = () => {

    const { authAxios, user } = useAuth();
    const [polls, setPolls] = useState<PollDto[] | null>();

    useEffect(() => {
        async function fetchPolls() {
            if (user) {
                console.log(user)
                const response = await getAll(user?.email, authAxios)
                setPolls(response.data);
            }
        }
        fetchPolls();
    }, [user])

    const getSumOfParticipants = (options: OptionDto[]) => {
        let sum = 0;
        options.map(option => sum += option.voteCount);
        return sum;
    }

    return (
        <>
            {polls?.map(poll => (
                <Link to={`/poll/${poll.id}`} className="relative flex items-center border border-gray-300 hover:border-gray-400 rounded-md py-4 px-6 gap-x-25 cursor-pointer">
                    <div className="flex flex-row gap-x-3 me-auto">
                        <span className="bg-green-500 inline-block rounded-md p-3">
                            <Icon_LivePoll />
                        </span>
                        <div className="flex flex-col">
                            <span className="text-md font-semibold">{poll.title}</span>
                            <span className="text-xs font-light text-gray-500">*(Created Date)</span>
                        </div>
                    </div>
                    <span>{getSumOfParticipants(poll.options)}</span>
                    <span>-</span>
                    <span className="text-xs font-semibold rounded-2xl bg-green-100 text-teal-800 p-2 me-25 items-center">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 me-1 mb-0.5"></span>
                        Live
                    </span>
                    <button className="absolute end-5 inline-flex items-center justify-center focus:outline-blue-700 focus:outline-2 w-8 h-8 rounded-full hover:bg-gray-100 cursor-not-allowed"
                    disabled>
                        <Icon_Ellipsis />
                    </button>
                </Link>
            ))}
        </>
    );
}