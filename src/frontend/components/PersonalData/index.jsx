import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PersonalDataContent from './personalData';
import ConfirmDeleteAccount from './confirmDeleteAccount';

class PersonalDataComponent extends React.Component {
    render() {
        return (
                <Switch>
                    <Route exact path="/personalData" component={PersonalDataContent} />
                    <Route exact path="/confirmDeleteAccount" component={ConfirmDeleteAccount} />
                </Switch>
        );
    }
}

export default PersonalDataComponent;