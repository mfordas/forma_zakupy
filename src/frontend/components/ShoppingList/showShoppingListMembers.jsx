import React from 'react';
import axios from 'axios';
import setHeaders from '../../utils/setHeaders';
import '../../main_styling/main_styling.scss';

class ShowShoppingListMembers extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            shoppingListId: this.props.id,
            membersIds: [],
            members: []
        }
    };

    getMembersIds = async () => {
        let members = await axios({
            url: `/api/shoppingLists/${this.state.shoppingListId}/members`,
            method: "GET",
            headers: setHeaders()
        });
        this.setState({ membersIds: members.data });
    }

    getMembersData = async () => {
        let membersArray = await Promise.all(this.state.membersIds.map(async memberId => (await axios({
            url: `/api/users/byId/${memberId}`,
            method: "GET",
            headers: setHeaders()
        }).then(res => res.data))));
        this.setState({ members: membersArray });
    };

    deleteMemberFromShoppingList = async (memberId) => {
        await axios({
            url: `/api/users/${memberId}/shoppingList/${this.state.shoppingListId}`,
            method: 'PUT',
            headers: setHeaders()
        }).then(res => {
            if (res.status === 200) {
                this.getMembersIds();
            } else {
                console.log('warrning');
            }
        },
            error => {
                console.log(error);
            }
        );
    }

    async componentDidMount() {
        await this.getMembersIds();
        await this.getMembersData();
    }

    async componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(this.state.membersIds) !== JSON.stringify(prevState.membersIds)) {
            await this.getMembersData();
        }
    };


    render() {
        return (
            <div className="container-products">
                {this.state.members.map(member => {
                    return <div key={member._id} className="container-shoppingList">
                        <div className="shoppinglist-name">
                            <p >{member.name}</p>
                        </div>
                        <button className="button" onClick={() => this.deleteMemberFromShoppingList(member._id)}>Usuń</button>
                    </div>
                })}
            </div>
        );
    }
}

export default ShowShoppingListMembers;