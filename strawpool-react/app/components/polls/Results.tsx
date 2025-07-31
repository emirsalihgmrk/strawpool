import type { PollDto } from "~/dto/PollDto"
import type { Route } from "./+types/Results";
import { useEffect, useState } from "react";
import { useAuth } from "~/auth/AuthContext";
import { get } from "~/api/ApiPoll";
import { Link } from "react-router";
import { Icon_Arrow } from "../icons/Icon_Arrow";

export async function loader({ params }: Route.LoaderArgs) {
    return { pollId: params.pollId }
}


export default function Results({ loaderData }: Route.ComponentProps) {
    const colors = [
        "#3EB991",
        "#FF7563",
        "#AA66CC",
        "#FFBB33",
        "#FF8800",
        "#33B5E5"
    ]
    const { loading, authAxios, isLoggedIn } = useAuth();
    const [poll, setPoll] = useState<PollDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading) {
            const fetchPoll = async () => {
                try {
                    const fetchedPoll = await get(loaderData.pollId, authAxios);
                    setPoll(fetchedPoll.data)
                } catch (error) {
                    setError("An error ocurred while loading the poll")
                    console.log("Failed to fetch poll:", error);
                }
            }
            fetchPoll();
        }
    }, [loaderData.pollId, loading])

    const sumOfVoteCounts = () => {
        let sum = 0;
        poll?.options.map(option => sum += option.voteCount);
        return sum;
    }

    const getRatioOfOption = (voteCount: number) => {
        return (voteCount/sumOfVoteCounts()*100).toFixed(1);
    }

    return (
        <div className="flex justify-center">
            <div className="flex flex-col mt-10 bg-white p-8 border border-gray-200 border-t-4 border-t-yellow-400 rounded-md w-[720px] text-gray-700">
                <span className="font-bold text-xl">{poll?.title}</span>
                <span className="text-gray-500 mt-2">{poll?.user ? "by " + poll.user.email : ''}</span>
                <div className="flex flex-col gap-y-3 items-start mt-5">
                    {poll?.options.map(
                        (option, index) => (
                            <div>
                                <div className="flex justify-between">
                                    <span>{option.value}</span>
                                    <span>{getRatioOfOption(option.voteCount)}% ({option.voteCount} votes)</span>
                                </div>
                                <div className="relative w-100 h-5 rounded-lg border border-gray-300">
                                    <span className="absolute r-0 h-full rounded-lg" style={{ backgroundColor: colors[index], width: `${getRatioOfOption(option.voteCount)}%`}}></span>
                                </div>
                            </div>
                        )
                    )}
                </div>
                <hr className="text-gray-300 mt-10"/>
                <span className="mt-2">Total votes: {sumOfVoteCounts()}</span>
                <Link to={`/poll/${loaderData.pollId}`} className="input flex w-fit mt-10">
                    <span className="rotate-180"><Icon_Arrow/></span> Back to poll
                </Link>
            </div>
        </div>
    )
}