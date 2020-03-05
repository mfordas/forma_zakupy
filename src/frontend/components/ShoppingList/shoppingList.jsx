import React from 'react';
import axios from 'axios';
import AddNewShoppingList from './addNewShoppingList';
import DeleteShoppingList from './deleteShoppingList';
import '../../main_styling/main_styling.scss';

class ShoppingList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            shoppingLists: [],
            addShoppingListActive: false,
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

    openNewShoppingListForm = () => {
        this.setState({addShoppingListActive: !this.state.addShoppingListActive});
    }

    componentDidMount() {
        this.getShoppingLists();
    }


    render() {
        return (
            <div className="container-shoppingLists">
                <button className="button" onClick={this.openNewShoppingListForm}>Dodaj listę zakupów</button>
                {this.state.addShoppingListActive ? <AddNewShoppingList/> : null}
                {this.state.shoppingLists.map(list =>
                    <div key={list._id} className="container-shoppingList">
                        <div className="shoppinglist-name">
                            <p>{list.name}</p>
                        </div>
                        <div className="shoppinglist-productsNumber">
                            <p>{list.products.length}</p>
                        </div>
                        <button className="button" onClick={this.getShoppingList}>Przejdź</button>
                        <DeleteShoppingList onClick={this.getShoppingLists} id={list._id}/> </div>)}
            </div>
        );
    }
}

export default ShoppingList;