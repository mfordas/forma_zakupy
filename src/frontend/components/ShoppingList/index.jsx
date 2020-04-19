import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ShowShoppingLists from './showShoppingLists';
import ShowShoppingList from './showShoppingList';


class ShoppingListContent extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/shoppingLists" render={(props) => <ShowShoppingLists {...props} type={'private'} />} />
                <Route exact path="/commonShoppingLists" render={(props) => <ShowShoppingLists {...props} type={'common'} />} />
                <Route path="/shoppingList/:name" component={ShowShoppingList} />
            </Switch>
        );
    }
}

export default ShoppingListContent;