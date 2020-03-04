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


    deleteShoppingList = async () => {
        const id = localStorage.getItem('id');
        const idSL = this.state.idShoppingList;
        await axios({
            url: `api/users/${id}/shoppingList/${idSL}`,
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

    render() {
        return (
                <button className="button" onClick={this.deleteShoppingList}>Usuń</button>
        );
    }
}

export default DeleteShoppingList;