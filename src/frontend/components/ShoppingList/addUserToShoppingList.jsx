import React from 'react';
import axios from 'axios';
import setHeaders from '../../utils/setHeaders';
import '../../main_styling/main_styling.scss';

class AddUserToShoppingList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            idUser: '',
            idShoppingList: this.props.id,
            userAdded: null,
            usersProposals: []
        }
    }

    addUserToList = async (idUser) => {
        console.log(this.state.idUser);
        const id = this.state.idShoppingList;
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
            <>
                <div className="container-add-shoppingList">
                    <p>Nazwa użytkownika</p>
                    <input onChange={e => {
                        this.showUsersProposals(e);
                    }} />
                </div>
                <div>
                    {this.state.usersProposals.map(user => <div key={user._id} id={user._id} value={user.name}>{user.name}<button className="button" onClick={() => this.addUserToList(user._id)}>Dodaj</button></div>)}
                </div>
            </>
        );
    }
}

export default AddUserToShoppingList;