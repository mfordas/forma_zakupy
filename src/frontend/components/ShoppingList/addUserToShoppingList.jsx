import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { addUserToList, showUsersProposals, getMembersIds, getMembersData, resetUsersProposals } from '../../redux_actions/shoppingListActions';
import { addNotification } from '../../redux_actions/notificationsActions';
import '../../main_styling/main_styling.scss';

class AddUserToShoppingList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            userSearchInput: ''
        }
    }

    addUser = async (user) => {
        const { idShoppingList } = this.props.shoppingListsData.shoppingListInfo;
        this.props.addUserToList(idShoppingList, user._id);
        await this.props.getMembersIds(this.props.shoppingListsData.shoppingListInfo.idShoppingList);
        await this.props.getMembersData(this.props.shoppingListsData.shoppingListInfo.membersIds);
        await this.props.addNotification(user._id, this.props.loginData.me, 'user');
    }

    componentDidMount () {
        this.setState({userSearchInput: ''});
    }

    componentWillUnmount() {
        this.props.resetUsersProposals();
    }
    
    render() {
        
        return (
            <>
                <div className="container-add-shoppingList">
                    <div className="horizontalFormContainer">
                    <p>Nazwa</p>
                    <input onChange={e => {
                        this.setState({userSearchInput: e.target.value}, 
                            () => this.props.showUsersProposals(this.state.userSearchInput));
                    }} />
                </div>
                </div>
                <div>
                    {this.props.shoppingListsData.usersProposals.map(user => <div className="horizontalFormContainer" key={user._id} id={user._id} value={user.name}>{user.name}<button className="button" onClick={() => this.addUser(user) }>Dodaj</button></div>)}
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    shoppingListsData: state.shoppingListsData,
    loginData: state.loginData,
  });
  
  AddUserToShoppingList.propTypes = {
    shoppingListsData: PropTypes.object,
    loginData: PropTypes.object,
  }

  export default connect(mapStateToProps, { addUserToList, showUsersProposals, getMembersIds, getMembersData, resetUsersProposals, addNotification })(AddUserToShoppingList);