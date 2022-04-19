import styled from "styled-components";
import { BsCheckLg } from "react-icons/bs";
import {useContext, useState} from "react";
import {doVote} from "../api/GoApi";
import {useNavigate} from "react-router-dom";
import {EncryptedVote} from "../model/EncryptedVote";
import {VoteContext} from "../provider/EncryptedVoteProvider";

const Container = styled.div`
    display: inline-flex;
    flex-direction: column;
    width: 55vw;
    height: 70vh;
    background-color: #141b2a;
    border-radius: 18px;
    elevation: 45deg;
    box-shadow: 0 1rem 2rem 0 rgba(0,0,0,0.3);
    box-sizing: border-box;
`

const Header = styled.div`
    background-color: #08b9a5;
    height: 4vw;
    width: 100%;
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    padding-bottom: 10px;
`

const Title = styled.div`
    font-weight: bold;
    padding-top: 0.5vw;
    padding-left: 12px;
    font-size: 1.3em;
`

const Button = styled.button`
    background-color: #08b9a5;
    align-self: end;
    margin-right: 4vw;
    border: none;
    border-radius: 6px;
    color: white;
    margin-bottom: 3vh;
    width: 15%;
    text-align: left;
    min-width: fit-content;
    height: 2em;
    margin-top: -10px;
    &:hover {
    opacity: 0.9;
    }
    box-shadow: 0 0.5rem 1rem 0 rgba(0,0,0,0.3);
    box-sizing: border-box;
`

const Poll = styled.form`
    margin: 3%;
    width: 94%;
    height: 94%;
    display: grid;
`

const ImageContainer = styled.div`
  max-width: 16vh;
  max-height: 16vh;
  object-fit: contain;
  display: block;
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  vertical-align: bottom;
`

const Option = styled.label`
  border: 2px solid #9897a9;
  max-height: 100%;
  :first-child {
    border-bottom: none;
  }
  
  :last-child {
    border-top: none;
  }
  :hover {
    opacity: 80%;
  }
  display: flex;
  flex-direction: row;
`

const RadioButton = styled.input`
  align-self: center;
  cursor: pointer;
  width: 38px;
  height: 38px;
  margin-left: 25px;
  margin-right: 20px;
  &:hover {
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 100px;
    background: #ccc;
    &::after {
      display: block;
      color: white;
      width: 12px;
      height: 12px;
      margin: 4px;
    }
  }
  &:checked {
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 100px;
    background: white;
    border: 12px solid #08b9a5;
    &::after {
      display: block;
      color: white;
      width: 12px;
      height: 12px;
      margin: 4px;
    }
  }
`

export function MainPage() {
    let [option, setOption] = useState<Number>(1)
    const { vote, setVote } = useContext(VoteContext)
    let navigate = useNavigate()
    const submitVote = () => {
        doVote(option).then((response) => {
            setVote(response.data)
            navigate('/confirmation')
        })
    }

    return(
        <Container>
            <Header>
                <Title>2022 France presidential election</Title>
            </Header>
            <Poll>
                <Option>
                    <ImageContainer>
                        <Image src="../../images/macron.jpg"></Image>
                    </ImageContainer>
                    <RadioButton
                        type="radio"
                        name="radio"
                        value="1"
                        checked={option === 1}
                        onChange={event => setOption(parseInt(event.currentTarget.value))}
                    />
                    <p style={{ fontSize: "1.5em", alignSelf: "center"}}>
                        Emmanuel Macron
                    </p>
                </Option>
                <Option>
                    <ImageContainer>
                        <Image src="../../images/le-pen.jpg"></Image>
                    </ImageContainer>
                    <RadioButton
                        type="radio"
                        name="radio"
                        value="2"
                        checked={ option === 2 }
                        onChange={event => setOption(parseInt(event.currentTarget.value))}
                    />
                    <p style={{ fontSize: "1.5em", alignSelf: "center"}}>
                        Marine Le Pen
                    </p>
                </Option>
                <Option>
                    <ImageContainer>
                        <Image src="../../images/melenchon.jpg"></Image>
                    </ImageContainer>
                    <RadioButton
                        type="radio"
                        name="radio"
                        value="3"
                        checked={ option === 3 }
                        onChange={event => setOption(parseInt(event.currentTarget.value))}
                    />
                    <p style={{ fontSize: "1.5em", alignSelf: "center"}}>
                        Jean-Luc Mélenchon
                    </p>
                </Option>
            </Poll>
            <Button onClick={() => submitVote()}>
                Submit
                <BsCheckLg style={ { fontSize: 20, paddingLeft: 8}}/>
            </Button>
        </Container>
    )
}