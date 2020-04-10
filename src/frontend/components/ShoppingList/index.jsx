import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import ShowShoppingLists from './showShoppingLists';
import ShowShoppingList from './showShoppingList';


class ShoppingListContent extends React.Component {
    render() {
        return (
            <BrowserRouter>
                    {/* <Route exact path="/shoppingLists" component={ShowShoppingLists} /> */}
                    <Route exact path="/shoppingLists" render={(props) => <ShowShoppingLists {...props} type={'private'} />}/>
                    <Route exact path="/commonShoppingLists" render={(props) => <ShowShoppingLists {...props} type={'common'} />}/>
                    <Route exact path="/shoppingList/:name" component={ShowShoppingList} />
            </BrowserRouter>
        );
    }
}

export default ShoppingListContent;