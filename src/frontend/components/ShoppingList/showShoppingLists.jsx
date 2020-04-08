import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import AddNewShoppingList from './addNewShoppingList';
import DeleteShoppingList from './deleteShoppingList';
import AddUserToShoppingList from './addUserToShoppingList';
import '../../main_styling/main_styling.scss';

class ShowShoppingLists extends React.Component {
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
                {this.state.addShoppingListActive ? <AddNewShoppingList onClick={this.getShoppingLists}/> : null}
                {this.state.shoppingLists.map(list =>
                    <div key={list._id} className="container-shoppingList">
                        <div className="shoppinglist-name">
                            <p>{list.name}</p>
                        </div>
                        <div className="shoppinglist-productsNumber">
                            <p>{list.products.length}</p>
                        </div>
                        <Link className="button" to={{pathname:`/shoppingList/${list.name}`, listInfo:{id:list._id, name:list.name}}}>Przejdź</Link>
                        <AddUserToShoppingList onClick={this.getShoppingLists} id={list._id}/>
                        <DeleteShoppingList onClick={this.getShoppingLists} id={list._id}/> </div>)}
            </div>
        );
    }
}

export default ShowShoppingLists;