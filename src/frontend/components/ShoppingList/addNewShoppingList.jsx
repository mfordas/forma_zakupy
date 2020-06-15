import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { addShoppingList, getShoppingLists } from '../../redux_actions/shoppingListActions';
import '../../main_styling/main_styling.scss';

class AddNewShoppingList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            shoppingListName: ''
        }
    }

    render() {
        return (
                <div className="container-add-shoppingList">
                    <div className="horizontalFormContainer">
                <p>Nazwa</p>
                <input onChange={e => this.setState({ shoppingListName: e.target.value })}></input>
                </div>
                <button className="button" onClick={() => {this.props.addShoppingList(this.state.shoppingListName); this.props.getShoppingLists()}}>Dodaj</button>
                </div>
        );
    }
}

const mapStateToProps = (state) => ({
    shoppingListsData: state.shoppingListsData,
  });
  
  AddNewShoppingList.propTypes = {
    shoppingListsData: PropTypes.object
  }

  export default connect(mapStateToProps, { addShoppingList, getShoppingLists })(AddNewShoppingList);