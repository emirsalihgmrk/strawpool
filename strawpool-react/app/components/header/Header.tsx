import { useAuth } from "~/auth/AuthContext";
import { Logo_StrawPoll } from "../icons/Logo_StrawPoll";
import { Link } from "react-router";

export const Header = () => {

    const { isLoggedIn, user, loading } = useAuth();

    if (loading) {
        return (<div className="flex justify-center items-center min-h-screen bg-gray-100">
            <p className="text-xl text-gray-700">Oturum kontrol ediliyor...</p>
        </div>)
    }

    return (
        <div className="flex flex-row gap-x-10 items-center justify-center py-5 border-b-2 border-gray-200 text-sm text-gray-800 font-semibold">
            <Link to={`${isLoggedIn ? '/dashboard' : '/'}`}>
                <Logo_StrawPoll />
            </Link>
            <Link to="/create/">Create Poll</Link>
            <button className="cursor-not-allowed" disabled>Schedule Meeting</button>
            <button className="cursor-not-allowed" disabled>Demo</button>
            <button className="cursor-not-allowed" disabled>Pricing</button>
            <div className="relative w-75">
                <svg className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" x-description="Heroicon name: solid/search"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"></path>
                </svg>
                <input className="input pl-8 w-full" type="text" name="" id="" placeholder="Search" />
            </div>
            {isLoggedIn ?
                <div className="flex flex-row gap-x-2 items-center">
                    <img className="rounded-full" src="https://placehold.co/30x30" alt="" />
                    <label>{user?.email}</label>
                    <span className="text-xs rounded-2xl bg-green-100 text-teal-900 p-1">free</span>
                </div>
                :
                <div className="flex gap-x-3">
                    <Link to={'/signin'} className="input border-none hover:text-indigo-300 hover:bg-white cursor-pointer">Login</Link>
                    <button className="buttonIndigo">Sign up</button>
                </div>
            }
        </div>
    );
}