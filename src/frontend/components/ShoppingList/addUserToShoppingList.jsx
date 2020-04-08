import React from 'react';
import axios from 'axios';
import setHeaders from '../../utils/setHeaders';
import { TiUserAdd } from 'react-icons/ti';
import '../../main_styling/main_styling.scss';

class AddUserToShoppingList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            idUser: '',
            idShoppingList: this.props.id,
            userAdded: null,
            addUserToShoppingListActive: false,
            usersProposals: []
        }
    }

    addUserToList = async () => {
        console.log(this.state.idUser);
        const id = this.state.idShoppingList;
        let idUser = this.state.idUser;
        await axios({
            url: `/api/shoppingLists/${id}/commonShoppingList/${idUser}`,
            method: 'PUT',
            headers: setHeaders()

        }).then(res => {
            if (res.status === 200) {

                this.setState({ userAdded: true });
            } else {
                this.setState({ userAdded: false });
            }
        },
            error => {
                console.log(error);
            }
        );

        this.props.onClick();

    };


    showUsersProposals = async (e) => {
        if (e.target.value.length >= 3) {
            let usersList = await axios({
                url: `/api/users/${e.target.value}`,
                method: 'GET',
                headers: setHeaders(),
                data: {
                    name: this.state.productName
                }
            });
            this.setState({ usersProposals: usersList.data });
        }
    }

    render() {
        return (
            <div className="container-add-shoppingList">
                <button className="button" onClick={() => this.setState({ addUserToShoppingListActive: !this.state.addUserToShoppingListActive })}><TiUserAdd size="1.1rem"/></button>
                {this.state.addUserToShoppingListActive ?
                    <>
                        <p>Nazwa użytkownika</p>
                        <input list="usersProposals" onChange={e => {
                            this.showUsersProposals(e);
                            this.setState({idUser: e.target.value });
                            
                        }} />
                        <datalist id="usersProposals">
                            {this.state.usersProposals.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                        </datalist>
                        <button className="button" onClick={this.addUserToList}>Dodaj</button>
                    </> : null}
            </div>
        );
    }
}

export default AddUserToShoppingList;