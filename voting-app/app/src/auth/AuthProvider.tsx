import React from "react";
import { AuthContext } from "../router/ApplicationRouter";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    let [user, setUser] = React.useState<any>(null);

    let signin: any = (callback: VoidFunction) => {
        return signin(() => {
            setUser("newUser");
            callback();
        });
    };

    let signout: any = (callback: VoidFunction) => {
        return signout(() => {
            setUser(null);
            callback();
        });
    };

    let value = { user, signin, signout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}