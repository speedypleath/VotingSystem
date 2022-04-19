import {Route, Routes} from "react-router-dom";
import {LoginPage} from "../pages/LoginPage";
import {RequireAuth} from "../auth/RequireAuth";
import {MainPage} from "../pages/MainPage";
import React from "react";
import {AuthContextType} from "../auth/AuthContextType";
import {AuthProvider} from "../auth/AuthProvider";
import {EncryptedVoteProvider} from "../provider/EncryptedVoteProvider";
import {ConfirmationPage} from "../pages/ConfirmationPage";

export function ApplicationRouter() {
    return (
        <AuthProvider>
            <EncryptedVoteProvider>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/vote" element={
                    <RequireAuth>
                        <MainPage />
                    </RequireAuth>
                } />
                <Route path="/confirmation" element={
                    <RequireAuth>
                        <ConfirmationPage/>
                    </RequireAuth>
                }/>
            </Routes>
            </EncryptedVoteProvider>
        </AuthProvider>
    )
}

export function useAuth() {
    return React.useContext(AuthContext);
}

export let AuthContext = React.createContext<AuthContextType>(null!);
