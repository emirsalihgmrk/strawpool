import { useEffect, useState } from "react"
import { Icon_DoubleArrow } from "../icons/Icon_DoubleArrow"
import { Icon_Cancel } from "../icons/Icon_Cancel";
import { PollType } from "../domain/PollType";
import { Icon_Arrow } from "../icons/Icon_Arrow";
import { LabelToggle } from "../elements/LabelToggle";

type Option = {
    id: number;
    value: string;
};

export const PollTypeSettings = (props: { type: PollType,setOptionValues: (values: string[]) => void }) => {

    const [showMultipleOptionPanel, setShowMultipleOptionPanel] = useState<boolean>(false);
    const [multipleOptionText, setMultipleOptionText] = useState<string>('');
    const [options, setOptions] = useState<Option[]>([{ id: Date.now(), value: '' }]);
    const [allowMultipleSelection, setAllowMultipleSelection] = useState<boolean>(false);
    const [showAdvancedSettings, setShowAdvancedSetting] = useState<boolean>(false);

    const addOption = (value: string) => {
        setOptions([...options, { id: Date.now() + Math.random(), value: value }]);
    }

    const removeOption = (id: number) => {
        setOptions(options.filter((option) => {
            return (
                option.id !== id
            )
        }))
    }

    useEffect(() => {
        if (showMultipleOptionPanel) {
            const AllOptions = options.map(option => option.value).join('\n')
            setMultipleOptionText(AllOptions)
        }
    }, [showMultipleOptionPanel])

    const addMultipleOption = () => {
        const optionList = multipleOptionText
            .split('\n')
            .map(option => option.trim())
            .filter(option => option.length > 0);

        if (optionList.length > 0) {
            const formattedOptions = optionList.map(option => ({
                id: Date.now() + Math.random(),
                value: option
            }));

            setOptions(formattedOptions);
        }
    };

    const handleOptionChange = (id: number, newValue: string) => {
        const updatedOptions = options.map((option) => {
            return (option.id === id ? { id: option.id, value: newValue } : option)
        })
        setOptions(updatedOptions)
        props.setOptionValues(updatedOptions.map(option => option.value))
    }

    return (
        <div className="flex flex-col gap-y-5">
            <div className="flex flex-col relative">
                <label htmlFor="AnswerOptions">Answer Options</label>
                {!showMultipleOptionPanel && options.map((option, index) => {
                    return (
                        <div key={index} className="relative mb-2">
                            <span className="absolute inset-y-0 -left-6 flex items-center cursor-move">
                                <Icon_DoubleArrow />
                            </span>
                            <input
                                type="text"
                                className="input py-1.5 w-full hover:bg-white"
                                placeholder={`Option ${index + 1}`}
                                value={option.value}
                                onChange={(e) => handleOptionChange(option.id, e.target.value)} />
                            {
                                options.length > 1 &&
                                <button type="button" className="absolute w-5 inset-y-0 right-3 flex items-center cursor-pointer text-gray-400" onClick={() => removeOption(option.id)}>
                                    <Icon_Cancel />
                                </button>
                            }
                        </div>
                    );
                })}
                <span className="absolute top-0 right-0 text-indigo-600 text-sm cursor-pointer" onClick={() => setShowMultipleOptionPanel(true)}>Paste Answers</span>
                {!showMultipleOptionPanel &&
                    <>
                        <div className="flex gap-x-2 items-center">
                            <button type="button" onClick={() => addOption('')} className="input w-fit px-2 py-0 inline-flex items-center gap-x-1 text-sm cursor-pointer"><span className="plus">+</span>Add Option</button>
                            <span className="text-sm">or <span className="text-indigo-600 cursor-pointer">Add "Other"</span></span>
                        </div>
                    </>
                }
                {showMultipleOptionPanel &&
                    <>
                        <textarea
                            name="answers"
                            id="answers"
                            className="input mb-2"
                            placeholder="Enter one answer option per line"
                            value={multipleOptionText}
                            onChange={(e) => setMultipleOptionText(e.target.value)}
                        ></textarea>
                        <div className="flex gap-x-2 w-fit">
                            <button type="button" className="buttonIndigo" onClick={() => { addMultipleOption(); setShowMultipleOptionPanel(false) }}>Preview</button>
                            <button type="button" className="input px-4 py-2" onClick={() => setShowMultipleOptionPanel(false)}>Cancel</button>
                        </div>
                    </>
                }
            </div>
            <hr className="border-t border-gray-300 mt-1" />
            <span className="text-xl font-semibold">Settings</span>
            <div className="flex items-center">
                <div className="flex flex-col w-full gap-y-5 border-r border-gray-300 pr-5">
                    {
                        (props.type === PollType.Multiple || props.type === PollType.Image) &&
                        <>
                            <LabelToggle label="Allow selection of multiple options" isActive={allowMultipleSelection} setIsActive={() => setAllowMultipleSelection(!allowMultipleSelection)} />
                            <LabelToggle label="Require participants name" isActive={allowMultipleSelection} setIsActive={() => setAllowMultipleSelection(!allowMultipleSelection)} />
                        </>
                    }
                    {
                        props.type === PollType.Meeting &&
                        <>
                            <LabelToggle label='Allow "If need be" answer' isActive={allowMultipleSelection} setIsActive={() => setAllowMultipleSelection(!allowMultipleSelection)} />
                            <LabelToggle label="Fixed time zone" isActive={allowMultipleSelection} setIsActive={() => setAllowMultipleSelection(!allowMultipleSelection)} />
                        </>
                    }
                </div>
                <div className="relative flex flex-col w-full pl-5 gap-y-5">
                    {
                        (props.type === PollType.Multiple || props.type === PollType.Image) &&
                        <div>
                            <span className="text-sm">Voting Security</span>
                            <span className="absolute text-sm text-indigo-500 top-0 right-0 cursor-pointer">Learn More</span>
                            <select className="focus:outline-blue-700 focus:outline-2 border border-gray-300 rounded-md shadow-xs p-2 text-gray-600 mt-1 w-full" name="filter_poll" id="filter_poll">
                                <option value="none">None (Multiple votes per person)</option>
                                <option value="browser">One vote per browser session</option>
                                <option value="ip">One vote per IP address</option>
                                <option value="email">One vote per email address</option>
                                <option value="Participated">One vote per unique code</option>
                            </select>
                        </div>
                    }
                    {
                        props.type === PollType.Meeting &&
                        <>
                            <LabelToggle label="Limit selection to one option only" isActive={allowMultipleSelection} setIsActive={() => setAllowMultipleSelection(!allowMultipleSelection)} />
                            <LabelToggle label="Hide unavailable options" isActive={allowMultipleSelection} setIsActive={() => setAllowMultipleSelection(!allowMultipleSelection)} />
                        </>
                    }
                </div>
            </div>
            <div className="flex items-center text-sm text-indigo-500 cursor-pointer"
                onClick={() => setShowAdvancedSetting(!showAdvancedSettings)}>
                <span className={`${showAdvancedSettings ? 'rotate-90' : ''}`}>
                    <Icon_Arrow />
                </span>
                Show advanced settings
            </div>
            {showAdvancedSettings &&
                <>
                    <div className="flex items-start">
                        <div className="flex flex-col justify-start w-full gap-y-5 pr-5">
                            {(props.type === PollType.Multiple || props.type === PollType.Image) &&
                                <LabelToggle label="Close poll on a schedule date" isActive={allowMultipleSelection} setIsActive={() => setAllowMultipleSelection(!allowMultipleSelection)} />
                            }
                            {props.type === PollType.Meeting &&
                                <LabelToggle label="Set a deadline" isActive={allowMultipleSelection} setIsActive={() => setAllowMultipleSelection(!allowMultipleSelection)} />
                            }
                            <LabelToggle label="Allow comments" isActive={allowMultipleSelection} setIsActive={() => setAllowMultipleSelection(!allowMultipleSelection)} />
                            <LabelToggle label="Hide share button" isActive={allowMultipleSelection} setIsActive={() => setAllowMultipleSelection(!allowMultipleSelection)} />
                        </div>
                        <div className="relative justify-start flex flex-col w-full pl-5 gap-y-3 border-l border-gray-300">
                            {(props.type === PollType.Multiple || props.type === PollType.Image) &&
                                <div className="flex flex-col">
                                    <span className="text-sm">Results Visibility</span>
                                    <span className="absolute text-sm text-indigo-500 top-0 right-0 cursor-pointer">Learn More</span>
                                    <select className="focus:outline-blue-700 focus:outline-2 border border-gray-300 rounded-md shadow-xs p-2 text-gray-600 mt-1" name="filter_poll" id="filter_poll">
                                        <option value="always">Always Public</option>
                                        <option value="afterEnd">Public after end date</option>
                                        <option value="afterVote">Public after vote</option>
                                        <option value="notPublic">Not public</option>
                                    </select>
                                </div>
                            }
                            <div className="flex flex-col">
                                <span className="text-sm mt-3">Edit vote permissions</span>
                                <span className="absolute text-sm text-indigo-500 top-0 right-0 cursor-pointer">Learn More</span>
                                <select className="focus:outline-blue-700 focus:outline-2 border border-gray-300 rounded-md shadow-xs p-2 text-gray-600 mt-1" name="filter_poll" id="filter_poll">
                                    <option value="nobody">Nobody</option>
                                    <option value="adminown">Admin & own votes</option>
                                    <option value="own">Own votes only</option>
                                    <option value="everybody">Everybody</option>
                                </select></div>
                            {(props.type === PollType.Multiple || props.type === PollType.Image) &&
                                <LabelToggle label="Voting interval" isActive={allowMultipleSelection} setIsActive={() => setAllowMultipleSelection(!allowMultipleSelection)} />
                            }
                            {props.type === PollType.Meeting && 
                                <LabelToggle label="Hide participant from each other" isActive={allowMultipleSelection} setIsActive={() => setAllowMultipleSelection(!allowMultipleSelection)} />
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
}