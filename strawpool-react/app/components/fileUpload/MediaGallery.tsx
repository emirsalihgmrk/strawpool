import { useRef } from "react";
import { Icon_Cancel } from "../icons/Icon_Cancel"
import { Icon_FileUpload } from "../icons/Icon_FileUpload"

export const MediaGallery = (props: { onClose: () => void }) => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDivClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
            <div className="bg-white flex flex-col rounded-md p-5 text-gray-700 border border-gray-300 w-128">
                <div className="flex justify-between items-center">
                    <span>Media Gallery</span>
                    <button className="input p-1 border-none cursor-pointer" onClick={props.onClose}>
                        <Icon_Cancel />
                    </button>
                </div>
                <hr className="-mx-5 my-5 border-t border-gray-300" />
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-gray-300 hover:border-gray-800 my-3 gap-y-5 p-5 bg-gray-50 cursor-pointer"
                     onClick={handleDivClick}>
                    <Icon_FileUpload />
                    <span className="flex flex-col">
                        Click to upload or drop an image right here
                        <span className="mx-auto text-gray-500">JPG,PNG, or GIF.Up to 4MB.</span>
                    </span>
                    <span className="flex flex-col items-center text-red-500 text-xs">
                        Offensive or explicit images are not permitted and will result in a
                        <span>ban.</span>
                    </span>
                </div>
                <hr className="-mx-5 my-5 border-t border-gray-300" />
                <button type="button" className="input cursor-pointer py-2" onClick={props.onClose}>Cancel</button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif"
                />
            </div>
        </div>

    )
}