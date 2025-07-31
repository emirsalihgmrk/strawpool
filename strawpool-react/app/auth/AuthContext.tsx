import axios, { type AxiosInstance } from "axios";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { logout as apiLogout, refreshToken } from "~/api/ApiAuth";
import type { UserDto } from "~/dto/UserDto";

interface AuthContextType {
    isLoggedIn: boolean;
    user: UserDto | null;
    login: (receivedAccessToken: string,userDto: UserDto) => void;
    logout: () => Promise<void>
    loading: boolean;
    authAxios: AxiosInstance;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = (props: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<UserDto | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const authAxios = axios.create({
        baseURL: 'http://localhost:8080/api',
        withCredentials: true,
        withXSRFToken: true
    });

    authAxios.interceptors.request.use(
        config => {
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`
            }
            return config;
        },
        error => Promise.reject(error)
    )

    authAxios.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const response = await refreshToken();
                    const newAccessToken = response.data.accessToken;

                    if (newAccessToken) {
                        setAccessToken(newAccessToken)
                        setUser(response.data.userDto)
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                        return authAxios(originalRequest)
                    }
                } catch (refreshError) {
                    console.error("Refresh token failed:", refreshError);
                    logout();
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    )

    const checkAuthStatus = useCallback(async () => {
        setLoading(true);
            try {
                const response = await refreshToken();
                const newAccessToken = response.data.accessToken;

                if (newAccessToken) {
                    setAccessToken(newAccessToken);
                    setUser(response.data.userDto);
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                    setAccessToken(null)
                }
            } catch (error) {
                console.error("Auth status check (via refresh token) failed.", error);
                setIsLoggedIn(false);
                setAccessToken(null);
            } finally {
                setLoading(false);
            }
    }, [])

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = (receivedAccessToken: string,userDto: UserDto) => {
        setIsLoggedIn(true);
        setAccessToken(receivedAccessToken);
        setUser(userDto);
    }

    const logout = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.log("Logout failed:", error);
        } finally {
            setIsLoggedIn(false);
            setAccessToken(null);
            setUser(null);
        }
    }
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-700">Oturum kontrol ediliyor...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn,user, login, logout, loading, authAxios }}>
            {props.children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}