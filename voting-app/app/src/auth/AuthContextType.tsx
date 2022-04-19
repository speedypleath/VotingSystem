import React from "react";
import {Voter} from "../model/Voter";

export interface AuthContextType {
    user: any;
    signIn: (user: Voter, callback: (response: String) => void) => void;
    signOut: (callback: VoidFunction) => void;
}