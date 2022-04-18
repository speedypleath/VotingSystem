import './App.css'
import './components/Card'
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { MainPage } from "./pages/MainPage";
import { RequireAuth }  from "./auth/RequireAuth"
import React from "react";
import {AuthContextType} from "./auth/AuthContextType";
import {LoginButton} from "./components/LoginButton";
import styled from "styled-components";

const Container = styled.div`
  width: 50vw;
  height: 80vh;
  background-color: #141b2a;
  border-radius: 18px;
  elevation: 45deg;
  box-shadow: 0 1rem 2rem 0 rgba(0,0,0,0.3);
`


function App({ children }: { children: React.ReactNode }) {
    return (
        <div className="App">
            <header className="App-header">
                { children }
            </header>
        </div>
    )
}

export default App
