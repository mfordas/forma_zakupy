import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { deleteShoppingListFromDataBase, removeShoppingListFromUsersShoppingLists, getShoppingLists } from '../../redux_actions/shoppingListActions';
import '../../main_styling/main_styling.scss';

class DeleteShoppingList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            idShoppingList: this.props.id
        }
    }

    deleteShoppingList = async () => {
        await this.props.removeShoppingListFromUsersShoppingLists(this.state.idShoppingList);
        this.props.getShoppingLists();
        await this.props.deleteShoppingListFromDataBase(this.state.idShoppingList);
    }

    render() {
        return (
                <button className="button" onClick={this.deleteShoppingList}>Usuń</button>
        );
    }
}

const mapStateToProps = (state) => ({
  shoppingListsData: state.shoppingListsData,
});

DeleteShoppingList.propTypes = {
  shoppingListsData: PropTypes.object
}

export default connect(mapStateToProps, { deleteShoppingListFromDataBase, removeShoppingListFromUsersShoppingLists, getShoppingLists })(DeleteShoppingList);