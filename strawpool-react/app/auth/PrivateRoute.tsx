import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext"

export default function PrivateRoute(){
    const {isLoggedIn,loading} = useAuth();
    if(loading){
        return(<div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-700">Oturum kontrol ediliyor...</p>
            </div>)
    }
    return isLoggedIn ? <Outlet/> : <Navigate to="/signin" replace/>
}