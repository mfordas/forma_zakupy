import React from 'react';
import Register from './register';
import { Route, Switch } from 'react-router-dom';
import Verification from './verificate';

class RegisterContent extends React.Component {
    render() {
        return (
                <Switch>
                    <Route exact path="/register" component={Register} />
                    <Route path="/register/verification/:token" component={Verification} />
                </Switch>
        );
    }
}

export default RegisterContent;