import styled from "styled-components";
import {EncryptedVote} from "../model/EncryptedVote";
import {useMemo, useState} from "react";

const Container = styled.div`
    width: 60vw;
    height: 60vh;
    background-color: #141b2a;
    border-radius: 18px;
    elevation: 45deg;
    box-shadow: 0 1rem 2rem 0 rgba(0,0,0,0.3);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
`

const Title = styled.div`
    align-self: center;
`

const Header = styled.h2`
    margin-bottom: -3vh;
    margin-top: -6vh;
    margin-left: 2vw;
`

const Info = styled.h4 `
    margin-left: 2vw;
    margin-bottom: -2vh;
`

export function ConfirmationPage() {
    const [vote, setVote] = useState<EncryptedVote>()
    return(
        <Container>
            <Title>
                <h1>Thanks for your vote!</h1>
            </Title>
            <Header>
                Your submission has been successful!
            </Header>
            <Info>
                Private key: { vote?.key }
            </Info>
            <Info>
                Encrypted message: { vote?.packet }
            </Info>
        </Container>
    )
}