import { useEffect, useRef, useState } from "react";
import { Icon_AddImage } from "../icons/Icon_AddImage";
import { MediaGallery } from "../fileUpload/MediaGallery";
import { Icon_DoubleArrow } from "../icons/Icon_DoubleArrow";
import { Icon_PollType_Multiple } from "../icons/Icon_PollType_Multiple";
import { Icon_PollType_Meeting } from "../icons/Icon_PollType_Meeting";
import { Icon_PollType_Image } from "../icons/Icon_PollType_Image";
import { Icon_PollType_Ranking } from "../icons/Icon_PollType_Ranking";
import { PollType } from "../domain/PollType"
import { PollTypeSettings } from "./PollTypeSettings";
import type { PollDto } from "~/dto/PollDto";
import type { OptionDto } from "~/dto/OptionDto";
import { create } from "~/api/ApiPoll";
import { useAuth } from "~/auth/AuthContext";
import { Navigate, useNavigate } from "react-router";


export default function CreatePoll() {
    const {authAxios} = useAuth();
    const [showDesc, setShowDesc] = useState<boolean>(false);
    const [showMediaGallery, setShowMediaGallery] = useState<boolean>(false);
    const [showPollTypeList, setShowPollTypeList] = useState<boolean>(false);
    const [pollType, setPollType] = useState<PollType>(PollType.Multiple);
    const [options,setOptions] = useState<OptionDto[]>([]);
    const defaultPollDto: PollDto = {
        id: null,
        title: '',
        description: '',
        pollType: pollType,
        options: options,
        user: null,
        anonymousId: null
    };
    const [pollDto, setPollDto] = useState<PollDto>(defaultPollDto);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();

    const createPoll = async() => {
        console.log("asds")
        const response = await create(pollDto,authAxios);
        return navigate(`/poll/${response.data.id}`)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPollDto(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        setPollDto(prev => ({
            ...prev,
            pollType: pollType,
            options: options
        }))
    },[pollType,options])

    const setOptionValues = (optionValues: string[]) => {
        setOptions(optionValues.map(optionValue => ({id: null,voteCount: 0,value:optionValue})));
    } 

    const returnActivePollTypeComponent = () => {
        switch (pollType) {
            case PollType.Multiple:
                return (
                    <div className="listElement hover:bg-gray-50 hover:text-inherit p-0">
                        <Icon_PollType_Multiple />
                        Multiple Choice
                    </div>
                );
            case PollType.Meeting:
                return (
                    <div className="listElement hover:bg-gray-50 hover:text-inherit p-0">
                        <Icon_PollType_Meeting />
                        Meeting Poll
                    </div>
                );
            case PollType.Image:
                return (
                    <div className="listElement hover:bg-gray-50 hover:text-inherit p-0">
                        <Icon_PollType_Image />
                        Image Poll
                    </div>
                );
            case PollType.Ranking:
                return (
                    <div className="listElement hover:bg-gray-50 hover:text-inherit p-0">
                        <Icon_PollType_Ranking />
                        Ranking Poll
                    </div>
                );
            default:
                return null;
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setShowPollTypeList(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col flex-1 justify-center items-center bg-gray-50">
            <span className="text-3xl font-extrabold mt-4">Create a Poll</span>
            <span className="text-sm font-md mt-3 text-gray-500">Complete the below fields to create your poll.</span>
            <form className="flex flex-col mt-10 bg-white p-8 border border-gray-200 border-t-4 border-t-yellow-400 rounded-md w-[720px] text-gray-700 gap-y-5">
                <div className="flex flex-col">
                    <label htmlFor="title">Title</label>
                    <input name="title" id="title" className="input" type="text" placeholder="Type your question here" required={true}
                        onChange={(e) => handleChange(e)} />
                    {!showDesc &&
                        <span className={`${showDesc ? 'hidden' : ''} inline-flex w-fit items-center gap-x-1 cursor-pointer text-sm`} onClick={() => setShowDesc(!showDesc)}>
                            <span className="plus">+</span>Add description or image</span>
                    }

                </div>
                <div className={`${!showDesc ? 'hidden' : ''} flex flex-col`}>
                    <label htmlFor="description">Description<span className="text-gray-500">(optional)</span></label>
                    <textarea name="description" id="description" className="input" onChange={(e) => handleChange(e)}></textarea>
                    <div className="flex justify-between mt-7">
                        <button type="button" className="buttonIndigo" onClick={() => setShowMediaGallery(true)}>
                            <Icon_AddImage />
                            Add image
                        </button>
                        <span className="text-sm cursor-pointer" onClick={() => setShowDesc(!showDesc)}>Hide Description</span>
                    </div>
                </div>
                <div className="flex flex-col w-[320px]">
                    <label htmlFor="Poll type">Poll type</label>
                    <button type="button" className="relative input w-full text-gray-500 py-1.5" ref={buttonRef} onClick={() => setShowPollTypeList(!showPollTypeList)}>
                        {returnActivePollTypeComponent()}
                        <span className="absolute inset-y-0 right-1 flex items-center pointer-events-none"><Icon_DoubleArrow /></span>
                    </button>
                    {showPollTypeList &&
                        <li className="list-none border border-gray-300 rounded-md transition-all duration-300 text-gray-500">
                            <ul className={`listElement ${pollType === PollType.Multiple ? 'bg-indigo-600 text-white' : ''}`}
                                onClick={() => { setPollType(PollType.Multiple); setShowPollTypeList(!showPollTypeList) }}>
                                <Icon_PollType_Multiple />
                                Multiple Choice
                            </ul>

                            <ul className={`listElement ${pollType === PollType.Meeting ? 'bg-indigo-600 text-white' : ''}`}
                                onClick={() => { setPollType(PollType.Meeting); setShowPollTypeList(!showPollTypeList) }}>
                                <Icon_PollType_Meeting />
                                Meeting Poll
                            </ul>

                            <ul className={`listElement ${pollType === PollType.Image ? 'bg-indigo-600 text-white' : ''}`}
                                onClick={() => { setPollType(PollType.Image); setShowPollTypeList(!showPollTypeList) }}>
                                <Icon_PollType_Image />
                                Image Poll
                            </ul>

                            <ul className={`listElement ${pollType === PollType.Ranking ? 'bg-indigo-600 text-white' : ''}`}
                                onClick={() => { setPollType(PollType.Ranking); setShowPollTypeList(!showPollTypeList) }}>
                                <Icon_PollType_Ranking />
                                Ranking Poll
                            </ul>
                        </li>
                    }
                </div>
                <PollTypeSettings type={pollType} setOptionValues={setOptionValues}/>
                <hr className="border-t border-gray-300 mt-1" />
                <div className="flex gap-x-2">
                    <button type="button" className="buttonIndigo px-15" onClick={() => createPoll()}>Create poll</button>
                    <button type="button" className="input px-15 py-2 cursor-not-allowed" disabled>Save as draft</button>
                </div>
            </form>
            {showMediaGallery && <MediaGallery onClose={() => setShowMediaGallery(false)} />}
        </div>
    )
}