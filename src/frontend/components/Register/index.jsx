import React from 'react';
import Register from './register';
import Verification from './verificate';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

class RegisterContent extends React.Component {
    render() {
        return (
            <BrowserRouter>
            <Switch>
            <Route exact path="/register" component={Register} />
            <Route path="/register/verification/:token" component={Verification} />
            </Switch>
            </BrowserRouter>
        );
    }
}

export default RegisterContent;