import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import logoSrc from "../../img/logotyp-08.png";
import '../../main_styling/main_styling.scss';


class LogoHomePage extends React.Component {

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







