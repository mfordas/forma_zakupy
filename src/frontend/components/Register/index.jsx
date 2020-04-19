import React from 'react';
import Register from './register';
import { BrowserRouter, Route } from 'react-router-dom';
import Verification from './verificate';

class RegisterContent extends React.Component {
    render() {
        return (
            <BrowserRouter>
            <Route exact path="/register" component={Register} />
            <Route exact path="/register/verification/:token" component={Verification} />
            </BrowserRouter>
        );
    }
}

export default RegisterContent;