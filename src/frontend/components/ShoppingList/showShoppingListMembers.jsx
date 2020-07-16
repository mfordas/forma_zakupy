import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { getMembersIds, getMembersData, deleteMemberFromShoppingList, removeShoppingListFromUsersShoppingLists } from '../../redux_actions/shoppingListActions';
import '../../main_styling/main_styling.scss';

class ShowShoppingListMembers extends React.Component {

    async componentDidMount() {
        await this.props.getMembersData(this.props.shoppingListsData.shoppingListInfo.membersIds);
    }

    async componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.shoppingListsData.shoppingListInfo.membersIds) !== JSON.stringify(prevProps.shoppingListsData.shoppingListInfo.membersIds)) {
            await this.props.getMembersData(this.props.shoppingListsData.shoppingListInfo.membersIds);
        }
    };

    deleteMember = async (member) => {
        await this.props.removeShoppingListFromUsersShoppingLists(member._id, this.props.shoppingListsData.shoppingListInfo.idShoppingList);
        await this.props.deleteMemberFromShoppingList(member._id, this.props.shoppingListsData.shoppingListInfo.idShoppingList);
        await this.props.getMembersIds(this.props.shoppingListsData.shoppingListInfo.idShoppingList)
    }


    render() {
        return (
            <div className="container-products">
                {this.props.shoppingListsData.members.map(member => {
                    return <div key={member._id} className="container-shoppingList">
                        <div className="shoppinglist-name">
                            <p >{member.name}</p>
                        </div>
                        <button className="button" onClick={() => this.deleteMember(member)}>Usuń</button>
                    </div>
                })}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    shoppingListsData: state.shoppingListsData,
  });
  
  ShowShoppingListMembers.propTypes = {
    shoppingListsData: PropTypes.object
  }

  export default connect(mapStateToProps, { getMembersIds, getMembersData, deleteMemberFromShoppingList, removeShoppingListFromUsersShoppingLists })(ShowShoppingListMembers);