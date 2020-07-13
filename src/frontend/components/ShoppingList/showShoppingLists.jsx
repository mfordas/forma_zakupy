import React from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { getShoppingLists, setShoppingListInfo } from '../../redux_actions/shoppingListActions';
import AddNewShoppingList from './addNewShoppingList';
import DeleteShoppingList from './deleteShoppingList';
import '../../main_styling/main_styling.scss';

class ShowShoppingLists extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            addShoppingListActive: false
        }
    }

    openNewShoppingListForm = () => {
        this.setState({ addShoppingListActive: !this.state.addShoppingListActive });
    }

    shoppingListsCompareMethod = (shoppingList, type) => {
        if (type === 'private') {
            return shoppingList.length === 1
        } else {
            return shoppingList.length > 1
        }
    }

    createListOfShoppingLists = (type) => {
        return this.props.shoppingListsData.shoppingLists.map(list => this.shoppingListsCompareMethod(list.members_id, type) ?
            <div key={list._id} className="container-shoppingList">
                <div className="shoppinglist-name">
                    <p>{list.name}</p>
                </div>
                <div className="shoppinglist-productsNumber">
                    <p>{list.products.length}</p>
                </div>
                <Link className="button" to={{ pathname: `/shoppingList/${list.name}`}} onClick={async () => await this.props.setShoppingListInfo(list)}>Przejdź</Link>

                <DeleteShoppingList id={list._id} membersIds={list.members_id} /> </div> : null)
    }

    componentDidMount() {
        this.props.getShoppingLists();
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.shoppingListsData.shoppingLists) !== JSON.stringify(prevProps.shoppingListsData.shoppingLists)) {
            this.props.getShoppingLists();
            this.createListOfShoppingLists();
        }
    };


    render() {
        return (
            <div className="container-shoppingLists">
                {this.props.type === 'private' ?
                    <>
                        <button className="button" onClick={this.openNewShoppingListForm}>Dodaj listę zakupów</button>
                        {this.state.addShoppingListActive ? <AddNewShoppingList/> : null}
                    </>
                    : null}
                {this.createListOfShoppingLists(this.props.type)}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    shoppingListsData: state.shoppingListsData,
  });
  
  ShowShoppingLists.propTypes = {
    shoppingListsData: PropTypes.object
  }

  export default connect(mapStateToProps, { getShoppingLists, setShoppingListInfo })(ShowShoppingLists);
