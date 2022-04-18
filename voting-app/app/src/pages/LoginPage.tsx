import {LoginButton} from "../components/LoginButton";
import styled from "styled-components";
import {useLocation, useNavigate} from "react-router-dom";
import React from "react";
import {useAuth} from "../router/ApplicationRouter";

const Container = styled.div`
  width: 50vw;
  height: 80vh;
  background-color: #141b2a;
  border-radius: 18px;
  elevation: 45deg;
  box-shadow: 0 1rem 2rem 0 rgba(0,0,0,0.3);
`

export function LoginPage() {
    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuth();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let username = formData.get("username") as string;

        auth.signin(username, () => {
            // Send them back to the page they tried to visit when they were
            // redirected to the login page. Use { replace: true } so we don't create
            // another entry in the history stack for the login page.  This means that
            // when they get to the protected page and click the back button, they
            // won't end up back on the login page, which is also really nice for the
            // user experience.
            navigate('/login', { replace: true });
        });
    }

    return (
        <Container>
            <p>
                Edit <code>App.tsx</code> and save to test HMR updates.
            </p>
            <LoginButton onClick={() => {}}/>
        </Container>
    )
}