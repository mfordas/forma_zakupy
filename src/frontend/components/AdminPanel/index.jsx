import React from 'react';
import { Switch, Route } from 'react-router-dom';
import UsersList from './usersList';
import UserInfo from './userInfo';

class AdminPanelComponent extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/adminPanel" component={UsersList} />
                <Route path="/adminPanel/:id" component={UserInfo} />
            </Switch>
        );
    }
}

export default AdminPanelComponent;