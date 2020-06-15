import React from 'react';
import { Link } from 'react-router-dom';
import { TiArrowSync, TiUserAdd, TiArrowBack, TiGroup, TiPlus } from 'react-icons/ti';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { showShoppingList, crossProduct, resetShoppingList } from '../../redux_actions/shoppingListActions';
import AddProduct from './addProduct';
import DeleteProductFromShoppingList from './deleteProducFromShoppingList';
import AddUserToShoppingList from './addUserToShoppingList';
import ProgressBar from './progressBar';
import ShowShoppingListMembers from './showShoppingListMembers'
import '../../main_styling/main_styling.scss';

class ShowShoppingList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            addProductActive: false,
            addUserActive: false,
            showShoppingListMembers: false
        }
    }

    openNewProductForm = () => {
        this.setState({ addProductActive: !this.state.addProductActive, addUserActive: false, showShoppingListMembers: false });
    }

    openNewUserForm = () => {
        this.setState({ addUserActive: !this.state.addUserActive, addProductActive: false, showShoppingListMembers: false });
    }
    showShoppingListMembers = () => {
        this.setState({ showShoppingListMembers: !this.state.showShoppingListMembers, addProductActive: false, addUserActive: false });
    }

    componentDidMount() {
        this.props.showShoppingList(this.props.shoppingListsData.shoppingListInfo.idShoppingList);
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.shoppingListsData.products) !== JSON.stringify(prevProps.shoppingListsData.products)) {
            this.props.showShoppingList(this.props.shoppingListsData.shoppingListInfo.idShoppingList);
        }
    };

    render() {
        const { idShoppingList, membersIds} = this.props.shoppingListsData.shoppingListInfo;
        const { products } = this.props.shoppingListsData;
        return (
            <div className="container-products">
                <div className="containerMenu">
                    <div className="button-container">
                        <button className="button" onClick={this.openNewProductForm}><TiPlus /></button>
                        <p>Dodaj produkt</p>
                    </div>
                    <div className="button-container">
                        <button className="button" onClick={this.openNewUserForm}><TiUserAdd /></button>
                        <p>Dodaj osobę</p>
                    </div>
                    <div className="button-container">
                        <button className="button" onClick={this.showShoppingListMembers}><TiGroup /></button>
                        <p>Zobacz osoby</p>
                    </div>
                    <div className="button-container">
                        <button className="button" onClick={() => {this.props.resetShoppingList(idShoppingList, products); this.props.showShoppingList(idShoppingList)}}><TiArrowSync /></button>
                        <p>Reset listy</p>
                    </div>
                    <div className="button-container">
                        <Link className="button" to={membersIds.length > 1 ? `/commonShoppingLists` : `/shoppingLists`}><TiArrowBack /></Link>
                        <p>Powrót</p>
                    </div>
                </div>
                {this.state.addProductActive ? <AddProduct onClick={() => this.props.showShoppingList(idShoppingList)} id={idShoppingList} /> : null}
                {this.state.addUserActive ? <AddUserToShoppingList onClick={this.openNewUserForm}/> : null}
                {this.state.showShoppingListMembers ? <ShowShoppingListMembers onClick={() => this.props.showShoppingList(idShoppingList)}/> : null}
                <ProgressBar allProducts={products} onChange={() => this.props.showShoppingList(idShoppingList)} />
                {products.map(product =>
                    <div key={product._id} className="container-product">
                        <div className="product-name" onClick={() => {this.props.crossProduct(idShoppingList, product.bought, product._id); this.props.showShoppingList(idShoppingList)}}>
                            <p style={product.bought ? { textDecorationLine: 'line-through', color: 'green' } : null}>{product.name}</p>
                        </div>
                        <div className="product-number">
                            <p style={product.bought ? { textDecorationLine: 'line-through', color: 'green' } : null}>{product.amount}</p>
                        </div>
                        <div className="product-number">
                            <p style={product.bought ? { textDecorationLine: 'line-through', color: 'green' } : null}>{product.unit}</p>
                        </div>
                        <DeleteProductFromShoppingList onClick={() => this.props.showShoppingList(idShoppingList)} idProd={product._id} />
                    </div>)}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    shoppingListsData: state.shoppingListsData,
  });
  
  ShowShoppingList.propTypes = {
    shoppingListsData: PropTypes.object
  }
  
  export default connect(mapStateToProps, { showShoppingList, crossProduct, resetShoppingList })(ShowShoppingList);