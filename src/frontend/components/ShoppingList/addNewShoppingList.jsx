import React from 'react';
import axios from 'axios';
import setHeaders from '../../utils/setHeaders';
import '../../main_styling/main_styling.scss';

class AddNewShoppingList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            shoppingListName: '',
            addShoppingListActive: false,
            shoppingListAdded: null
        }
    }


    addShoppingList = async () => {
        const id = localStorage.getItem('id');
        console.log(this.state);
        await axios({
            url: `api/shoppingLists/${id}/shoppingList`,
            method: 'POST',
            headers: setHeaders(),
            data: {
                name: this.state.shoppingListName
            }
        }).then(res => {
            if (res.status === 200) {

                this.setState({ shoppingListAdded: true});
              } else {
                this.setState({ shoppingListAdded: false });
              }
            },
            error => {
              console.log(error);
            }
        );

        this.props.onClick();

    }



    render() {
        return (
                <div className="container-add-shoppingList">
                    <div className="horizontalFormContainer">
                <p>Nazwa</p>
                <input onChange={e => this.setState({ shoppingListName: e.target.value })}></input>
                </div>
                <button className="button" onClick={this.addShoppingList}>Dodaj</button>
                </div>
        );
    }
}

export default AddNewShoppingList;