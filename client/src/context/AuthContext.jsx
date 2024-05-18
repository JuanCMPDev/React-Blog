import axios from 'axios';
import {createContext, useEffect, useState} from 'react';
import { Toaster, toast } from 'sonner';

export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user') || null))

    const login = async(inputs)=>{
        const res = await axios.post(`${BACKEND_URL}auth/login`, inputs, { withCredentials: true });
        setCurrentUser(res.data);
        toast.success("Inicio de sesión exitoso.")
    }

    const logout = async()=>{
        await axios.post(`${BACKEND_URL}auth/logout`, {}, { withCredentials: true });
        setCurrentUser(null);
        toast.success("Sesión cerrada con exito.")
    }

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(currentUser))
    }, [currentUser])

    return (
        <AuthContext.Provider value={{currentUser, login, logout}}>
            <Toaster/>
            {children}
        </AuthContext.Provider>
    )
}