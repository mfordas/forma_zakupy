import React from 'react';
import axios from 'axios';
import setHeaders from '../../utils/setHeaders';
import '../../main_styling/main_styling.scss';

class DeleteShoppingList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            shoppingListName: '',
            addShoppingListActive: false,
            shoppingListDeleted: null,
            idShoppingList: this.props.id
        }
    }


    removeShoppingListFromUsersShoppingLists = async () => {
        const idUser = localStorage.getItem('id');
        const id = this.state.idShoppingList;
        await axios({
            url: `api/shoppingLists/${id}/user/${idUser}`,
            method: "PUT",
            headers: setHeaders()
        }).then(res => {
            if (res.status === 200) {
                this.setState({ shoppingListDeleted: true});
              } else {
                this.setState({ shoppingListDeleted: false });
              }
            },
            error => {
              console.log(error);
            }
        );
    }

    deleteShoppingListFromDataBase = async () => {
        const idSL = this.state.idShoppingList;
        await axios({
            url: `api/shoppingLists/${idSL}`,
            method: "DELETE",
            headers: setHeaders()
        }).then(res => {
            if (res.status === 200) {
                this.setState({ shoppingListDeleted: true});
              } else {
                this.setState({ shoppingListDeleted: false });
              }
            },
            error => {
              console.log(error);
            }
        );
    }

    deleteShoppingList = async () => {
        await this.removeShoppingListFromUsersShoppingLists();
        await this.deleteShoppingListFromDataBase();
        this.props.onClick();
    }

    render() {
        return (
                <button className="button" onClick={this.deleteShoppingList}>Usuń</button>
        );
    }
}

export default DeleteShoppingList;