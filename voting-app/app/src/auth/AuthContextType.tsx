import React from "react";
import { signIn } from "../api/GoApi";

export interface AuthContextType {
    user: any;
    signin: (user: string, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
    let [user, setUser] = React.useState<any>(null);

    let signin: any = (newUser: string, callback: VoidFunction) => {
        return signin(() => {
            setUser(newUser);
            callback();
        });
    };

    let signout: any = (callback: VoidFunction) => {
        return signout(() => {
            callback();
        });
    };

    let value = { user, signin, signout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}