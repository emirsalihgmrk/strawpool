import { get, voteOption } from "~/api/ApiPoll";
import type { Route } from "./+types/Poll";
import { useAuth } from "~/auth/AuthContext";
import { useEffect, useState } from "react";
import type { PollDto } from "~/dto/PollDto";
import { Icon_Arrow } from "../icons/Icon_Arrow";
import { Icon_Limits } from "../icons/Icon_Limits";
import { Successful } from "./Successful";
import { Link } from "react-router";
import { Icon_Share } from "../icons/Icon_Share";
import { Icon_Visibility } from "../icons/Icon_Visibility";
import { Icon_Copy } from "../icons/Icon_Copy";

export async function loader({ params }: Route.LoaderArgs) {

    return { pollId: params.pollId }
}

export default function Poll({ loaderData }: Route.ComponentProps) {

    const { authAxios, loading, isLoggedIn, user } = useAuth();
    const [poll, setPoll] = useState<PollDto | null>(null);
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showSuccessfulAlert, setShowSuccessfulAlert] = useState<boolean>(false);
    const currentUrl = window.location.href;
    const [isShowCopied, setIsShowCopied] = useState(false);

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

    async function vote() {
        if (selectedOptionId) {
            await voteOption(selectedOptionId, authAxios);
            setShowSuccessfulAlert(true);
        } else {
            setError("Please choose an option");
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(currentUrl);
        setIsShowCopied(true);
        setTimeout(() => setIsShowCopied(false), 2000);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-700">Anket yükleniyor...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col mt-10 bg-white p-8 border border-gray-200 border-t-4 border-t-yellow-400 rounded-md w-[720px] text-gray-700">
                <span className="font-bold text-xl">{poll?.title}</span>
                <span className="text-gray-500 mt-2">{poll?.user ? "by " + poll.user.email : ''}</span>
                <span className="text-gray-500 mt-10">Make a choice:</span>
                <div className="flex flex-col gap-y-3 items-start mt-5">
                    {poll?.options.map(
                        option => (
                            <label key={option.id} className="inline-flex items-center">
                                <input className="hidden peer" type="radio" name="option" value={`${option.id}`}
                                    onChange={() => setSelectedOptionId(option.id)} />
                                <span className="radio">
                                    <span className="absolute w-2.5 h-2.5 bg-white rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
                                </span>
                                <span className="ms-2 mb-0.5">{option.value}</span>
                            </label>
                        )
                    )}
                </div>
                <div className="mt-7 inline-flex gap-x-3">
                    <button onClick={() => vote()} className="buttonIndigo">
                        Vote <Icon_Arrow />
                    </button>
                    <Link to={`/poll/${poll?.id}/results`} className="input flex items-center">
                        <Icon_Limits /> Show results
                    </Link>
                </div>
            </div>
            {user?.email === poll?.user?.email &&
                <div className="relative flex flex-col mt-10 bg-white p-8 border border-gray-200 rounded-md w-[720px] text-gray-700">
                    <div className="flex justify-between">
                        <span className="flex items-center"><Icon_Share /> Share</span>
                        <span className="flex items-center gap-x-2 text-xs border border-gray-300 rounded-md px-2"><Icon_Visibility /> Only visible to you</span>
                    </div>
                    <hr className="absolute inset-x-0 top-22 text-gray-300" />
                    <div className="flex flex-col items-center mt-20 mx-20">
                        <div className="flex justify-between w-full">
                            <span>Share the link</span>
                            <span className="text-indigo-500">Customize</span>
                        </div>
                        <div className="relative w-full">
                            <input type="text" className="input w-full" value={currentUrl} readOnly />
                            <span className="absolute flex items-center right-0 inset-y-0 border border-gray-300 px-2 cursor-pointer"
                                onClick={() => handleCopy()}><Icon_Copy /></span>
                            {isShowCopied &&
                                <div className="absolute -right-12 top-[-30px] flex flex-col items-center">
                                    <span className="bg-black text-white text-xs rounded-md px-3 py-1 whitespace-nowrap">
                                        Successfully copied.
                                    </span>
                                    <span className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
            {showSuccessfulAlert &&
                <Successful onClose={() => setShowSuccessfulAlert(false)} poll={poll} />
            }
        </div>
    )

}