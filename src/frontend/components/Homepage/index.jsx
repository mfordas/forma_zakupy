import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LogoHomePage from './logo';
import Login from './login';
import Register from './register';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {
        return (
            <BrowserRouter>
            <LogoHomePage />
            <Switch>
            <Route exact path="/home" component={Login} />
            <Route exact path="/home/register" component={Register} />
            </Switch>
            </BrowserRouter>
        );
    }
}

export default HomePage;