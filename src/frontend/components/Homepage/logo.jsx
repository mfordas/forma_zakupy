import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import logoSrc from "../../img/logotyp-08.png";
import './homepage.scss';


class LogoHomePage extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <BrowserRouter>
                <div className="logo-container">
                    <img className="logo" src={logoSrc} alt="Logo"></img>
                    <h1>ZAKUPY</h1>
                </div>
            </BrowserRouter>
        );
    }
}

export default LogoHomePage;







