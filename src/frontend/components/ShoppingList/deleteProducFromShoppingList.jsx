import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { showShoppingList, deleteProduct } from '../../redux_actions/shoppingListActions';
import '../../main_styling/main_styling.scss';

class DeleteProductFromShoppingList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            idProduct: this.props.idProd,
        }
    }

    deleteProduct = () => {
        this.props.deleteProduct(this.props.shoppingListsData.shoppingListInfo.idShoppingList, this.state.idProduct);
        this.props.showShoppingList(this.props.shoppingListsData.shoppingListInfo.idShoppingList);
    }

    render() {
        return (
                <button className="button" style={{backgroundColor: 'red', color: 'white'}} onClick={this.deleteProduct}>Usuń</button>
        );
    }
}

const mapStateToProps = (state) => ({
    shoppingListsData: state.shoppingListsData,
  });
  
  DeleteProductFromShoppingList.propTypes = {
    shoppingListsData: PropTypes.object
  }
  
  export default connect(mapStateToProps, { showShoppingList, deleteProduct })(DeleteProductFromShoppingList);