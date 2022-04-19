import React, {createContext, useState} from "react";
import {EncryptedVote} from "../model/EncryptedVote";

export function EncryptedVoteProvider({ children }: { children: React.ReactNode }) {
    const [vote, setVote] = useState<EncryptedVote | null>(null)
    const value = {
        vote: vote,
        setVote: setVote
    }

    return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
}

const useVote = () => {
    const [vote, setVote] = useState<EncryptedVote | null>(null)
    return { vote, setVote }
}

export let VoteContext = createContext({} as ReturnType<typeof useVote>)
