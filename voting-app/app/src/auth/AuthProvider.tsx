import React from "react";

import {signIn} from "../api/GoApi";
import {Voter} from "../model/Voter";
import {AuthContext} from "../router/ApplicationRouter";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    let [user, setUser] = React.useState<Voter | null>(null);

    let auth: any = async (voter: Voter, callback: (response: String) => {}) => {
        signIn(voter).then(() => {
                callback("success")
                setUser(voter)
            }
        ).catch((reason) => {
            callback(reason.response.data.message)
        })
    };

    let logOut: any = () => {
        setUser(null)
    };

    let value = { user: user, signIn: auth, signOut: logOut }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}