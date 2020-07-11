import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getUserShoppingListsInfo } from '../../redux_actions/adminPanelActions';
import DeleteShoppingList from '../ShoppingList/deleteShoppingList';
import '../../main_styling/main_styling.scss';

class UserShoppingLists extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    createListOfShoppingList = shoppingListsArray => {
        return shoppingListsArray.map(shoppingList => 
            <div key={shoppingList._id} className="userCard">
            <div className="userOption">
                <div className="userOptionContent">{shoppingList.name}</div>
                <div className="userOptionContent">{shoppingList.products.length}</div>
                <DeleteShoppingList onClick={() => this.props.getUserInfo} id={shoppingList._id} /> </div>
            </div>
            )
    }

    componentDidMount () {
        this.createListOfShoppingList(this.props.adminPanelData.userListsInfo)
    }

    render() {
        const { userListsInfo } = this.props.adminPanelData;

        return (
            <div className="container-usersList">
                    <div className="header" >{this.props.listsType}</div>
                <div style={{flexDirection: 'column'}} className="header-usersList">
                    {this.createListOfShoppingList(userListsInfo)}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    adminPanelData: state.adminPanelData,
});

UserShoppingLists.propTypes = {
    adminPanelData: PropTypes.object,
}

export default connect(mapStateToProps, { getUserShoppingListsInfo })(UserShoppingLists);