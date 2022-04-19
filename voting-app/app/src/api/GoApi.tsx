import axios from "axios";
import {Voter} from "../model/Voter";

export function signIn(voter: Voter) {
    return axios({
        method: 'POST',
        url: "http://localhost:8080/login",
        data: {
            name: voter.name,
            bits: Number(voter.token),
            password: voter.password,
            email: voter.email,
        },
        headers: {Accept: 'application/json',
            "Content-Type":"application/json"} })
}

export function doVote(option: Number) {
    return axios.post("http://localhost:8080/vote", { "option": option.toString() })
}