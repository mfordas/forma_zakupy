import React from 'react';
import Store from '../../../Store';
import axios from 'axios';
import '../../main_styling/main_styling.scss';

class ShoppingList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            shoppingLists: []
        }
    }

    getShoppingLists = async () => {
        const id = localStorage.getItem('id');
        let shoppingListIds = await axios.get(`api/shoppingLists/${id}/shoppingLists`);

        const idArray = shoppingListIds.data;

        await Promise.all(idArray.map(async listId => (await axios.get(`api/shoppingLists/${listId}`)
            .then(res => res.data))))
            .then(res => this.setState({ shoppingLists: res }));
    }

    getShoppingList = async () => {
        console.log(this.state.shoppingLists);
    }

    static contextType = Store;

    componentDidMount() {
        this.getShoppingLists();
    }


    render() {
        return (
            <div className="container-shoppingLists">
                {this.state.shoppingLists.map(list =>
                    <div className="container-shoppingList">
                        <div className="shoppinglist-name">
                            <p>{list.name}</p>
                        </div>
                        <div className="shoppinglist-productsNumber">
                            <p>{list.products.length}</p>
                        </div>
                        <button className="button" onClick={this.getShoppingList}>Przejdź</button></div>)}
            </div>
        );
    }
}

export default ShoppingList;