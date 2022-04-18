import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ApplicationRouter } from "./router/ApplicationRouter";
import {BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
  <React.StrictMode>
    <App>
        <ApplicationRouter/>
    </App>
  </React.StrictMode>
    </BrowserRouter>
)
