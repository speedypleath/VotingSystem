import './App.css'

import React, {useMemo, useState} from "react";
import {EncryptedVote} from "./model/EncryptedVote";

function App({ children }: { children: React.ReactNode }) {
    const [vote, setVote] = useState({key: "", packet: ""} as EncryptedVote);
    const value = useMemo(
        () => ({ vote, setVote }),
        [vote]
    )
    return (
        <div className="App">
            <header className="App-header">
                { children }
            </header>
        </div>
    )
}

export default App
