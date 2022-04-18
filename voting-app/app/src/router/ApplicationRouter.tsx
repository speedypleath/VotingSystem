import {Route, Routes} from "react-router-dom";
import {LoginPage} from "../pages/LoginPage";
import {RequireAuth} from "../auth/RequireAuth";
import {MainPage} from "../pages/MainPage";
import React from "react";
import {AuthContextType} from "../auth/AuthContextType";

export function ApplicationRouter() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/vote" element={
                <RequireAuth>
                    <MainPage />
                </RequireAuth>
            } />
        </Routes>
    )
}

export function useAuth() {
    return React.useContext(AuthContext);
}

export let AuthContext = React.createContext<AuthContextType>(null!);
