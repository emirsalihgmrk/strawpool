import { useState } from "react";
import { RadioButton } from "../elements/RadioButton";
import { signup } from "~/api/ApiAuth";
import type { SignUpRequest } from "~/dto/SignUp";
import { useNavigate } from "react-router";

export default function SignUp() {

    const navigate = useNavigate();

    const [request,setRequest] = useState<SignUpRequest>({
        name: "",
        email: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRequest(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            const response = await signup(request)
            if(response.status === 200){
                alert('Successfully signed up!')
                navigate('/login')
            } else {
                alert(response.data.message)
            }
        }catch(error){
            console.log('Hata:',error)
        }
    }

    return (
        <div className="flex flex-col items-center">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <a href="/">
                    <img className="mx-auto h-12 w-auto" src="https://strawpoll.com/images/logos/strawpoll-logo.svg" alt="StrawPoll" />
                </a>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Create a free account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Or
                    <a href="/login/" className="link">
                        log in to your account
                    </a>
                </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col mt-10 bg-white p-8 border border-gray-200 border-t-4 border-t-yellow-400 rounded-md w-[500px] text-gray-700 gap-y-5">
                <div>
                    <label htmlFor="email" className="label">
                        Name
                    </label>
                    <div className="mt-1">
                        <input 
                        id="name" 
                        name="name" 
                        type="text"
                        onChange={(e) => handleChange(e)}
                        required={true} 
                        className="input w-full" />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="label">
                        Email address
                    </label>
                    <div className="mt-1 relative">
                        <input 
                        id="email"
                        name="email" 
                        type="email"
                        onChange={(e) => handleChange(e)}
                        required={true} 
                        className="input w-full" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none" style={{ display: "none" }}>
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>

                            </svg>
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-red-600" id="title-error" style={{ display: "none" }}></p>
                </div>
                <div>
                    <label htmlFor="password" className="label">
                        Password
                    </label>
                    <div className="mt-1 relative">
                        <input 
                        id="password" 
                        name="password" 
                        type="password" 
                        required={true}
                        onChange={(e) => handleChange(e)}
                        className="input w-full"/>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none" style={{ display: "none" }}>
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>

                            </svg>
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-red-600" id="title-error" style={{ display: "none" }}></p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">

                        <div className="relative leading-none">
                            <RadioButton isActive={false} setIsActive={() => {}} />
                        </div>

                        <label htmlFor="terms-privacy" className="ml-3 block text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                            I agree to the <a href="/privacy/" target="_blank" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-500">privacy policy</a> and <a href="/terms/" target="_blank" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-500">terms of service</a>.
                        </label>
                    </div>
                </div>
                <button type="submit" className="buttonIndigo flex justify-center">Sign up</button>
            </form >
        </div>
    )
}