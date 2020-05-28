import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import AddNewShoppingList from './addNewShoppingList';
import DeleteShoppingList from './deleteShoppingList';
import setHeaders from '../../utils/setHeaders';
import '../../main_styling/main_styling.scss';

class ShowShoppingLists extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            shoppingLists: [],
            addShoppingListActive: false
        }
    }

    getShoppingLists = async () => {
        const id = localStorage.getItem('id');
        let shoppingListIds = await axios(
            {
                url:  `api/shoppingLists/${id}/shoppingLists`,
                method: 'GET',
                headers: setHeaders()
            }
            );
            
        const idArray = shoppingListIds.data;

        await Promise.all(idArray.map(async listId => (await axios(
            {
                url:  `api/shoppingLists/${listId}`,
                method: 'GET',
                headers: setHeaders()
            }
            
            )
            .then(res => res.data))))
            .then(res => this.setState({ shoppingLists: res }));
    }

    openNewShoppingListForm = () => {
        this.setState({addShoppingListActive: !this.state.addShoppingListActive});
    }

    shoppingListsCompareMethod = (shoppingList, type) => {
        if (type === 'private') {
            return shoppingList.length === 1  
        }  else {
            return shoppingList.length > 1
        } 
    }

    createListOfShoppingLists = (type) => {
        return  this.state.shoppingLists.map(list => this.shoppingListsCompareMethod(list.members_id, type) ?
            <div key={list._id} className="container-shoppingList">
                <div className="shoppinglist-name">
                    <p>{list.name}</p>
                </div>
                <div className="shoppinglist-productsNumber">
                    <p>{list.products.length}</p>
                </div>
                <Link className="button" to={{pathname:`/shoppingList/${list.name}`, listInfo:{id:list._id, name:list.name, members_id:list.members_id}}}>Przejdź</Link>
                
                <DeleteShoppingList onClick={this.getShoppingLists} id={list._id}/> </div> : null)
    }

    componentDidMount() {
        this.getShoppingLists();
    }


    render() {
        return (
            <div className="container-shoppingLists">
                {this.props.type === 'private' ? 
                <button className="button" onClick={this.openNewShoppingListForm}>Dodaj listę zakupów</button> : null}
                {this.state.addShoppingListActive ? <AddNewShoppingList onClick={this.getShoppingLists}/> : null}
                {this.createListOfShoppingLists(this.props.type)}
            </div>
        );
    }
}

export default ShowShoppingLists;