import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import React from "react";
import {useAuth} from "../router/ApplicationRouter";
import {Voter} from "../model/Voter";

const Container = styled.div`
  width: 50vw;
  height: 80vh;
  background-color: #141b2a;
  border-radius: 18px;
  elevation: 45deg;
  box-shadow: 0 1rem 2rem 0 rgba(0,0,0,0.3);
  box-sizing: border-box;
`

const Input = styled.input`
  width: 100%;
  height: 3vh;
  border: 2px solid #edf2f7;
  background-color: #f7fafc;
  color: #2d3748;
  border-radius: 6px;
  :focus {
    outline: none;
    border: 2px solid black;
  }
  type: { (props) => props.type }
`

const Row = styled.div`
    width: 30vw;
    padding: 1rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Button = styled.button`
  margin-top: 5px;
  type: submit;
  background-color: #555555;
  color: white;
  border: none;
  font-size: 1em;
  height: 6vh;
  width: 65vh;
  &:hover {
    opacity: 0.9;
  }
  box-shadow: 0 0.5rem 1rem 0 rgba(0,0,0,0.3);
  box-sizing: border-box;
`

const Error = styled.span`
  margin-bottom: 30px;
  margin-top: -15px;
  align-self: flex-start;
  margin-left: 10vw;
  color: red;
`

export function LoginPage() {
    let navigate = useNavigate();
    let auth = useAuth();
    let [response, setResponse] = React.useState<String | null>(null);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log("da")
        let formData = new FormData(event.currentTarget);
        console.log(formData.get("name"))
        let voter = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            token: formData.get("token") as unknown as number,
            password: formData.get("password") as string
        } as Voter
        auth.signIn(voter, (response: String) => {
            console.log(response)
            if(response == "success")
                navigate('/vote', { replace: true });
            else
                setResponse(response)
        });
    }

    return (
        <Container>
            <h2>Login</h2>
            <Form onSubmit={(event) => handleSubmit(event)} id="form">
                <Row>
                    <label>Token</label>
                    <Input type="text" name="token"/>
                </Row>
                <Row>
                    <label>Name</label>
                    <Input type="text" name="name"/>
                </Row>
                <Row>
                    <label>Email</label>
                    <Input type="text" name="email"/>
                </Row>
                <Row>
                    <label>Password</label>
                    <Input type="password" name="password"/>
                </Row>
                <Error>{ response }</Error>
                <Button type="submit" form="form">
                    Log In
                </Button>
            </Form>
        </Container>
    )
}