import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TiArrowSync, TiUserAdd, TiArrowBack, TiGroup, TiPlus } from 'react-icons/ti';
import AddProduct from './addProduct';
import setHeaders from '../../utils/setHeaders';
import DeleteProductFromShoppingList from './deleteProducFromShoppingList';
import AddUserToShoppingList from './addUserToShoppingList';
import ProgressBar from './progressBar';
import ShowShoppingListMembers from './showShoppingListMembers'
import '../../main_styling/main_styling.scss';

class ShowShoppingList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            products: [],
            name: props.location.listInfo.name,
            idShoppingList: props.location.listInfo.id,
            members: props.location.listInfo.members_id,
            addProductActive: false,
            addUserActive: false,
            showShoppingListMembers: false
        }
    }

    showShoppingList = async () => {
        let products = await axios({
            url: `/api/shoppingLists/${this.state.idShoppingList}/products`,
            method: "GET"
        });
        const productsArray = products.data;
        this.setState({ products: productsArray });
    }

    crossProduct = async (currentStatus, idProduct) => {
        const id = this.state.idShoppingList;
        await axios({
            url: `/api/shoppingLists/${id}/product/${idProduct}`,
            method: 'PUT',
            headers: setHeaders(),
            data: {
                bought: !currentStatus,
            }
        }).then(res => {
            if (res.status === 200) {
                this.showShoppingList();
            } else {
                console.log('warrning');
            }
        },
            error => {
                console.log(error);
            }
        );

    }

    resetShoppingList = async () => {
        const id = this.state.idShoppingList;
        this.state.products.map(async product => {
        await axios({
            url: `/api/shoppingLists/${id}/product/${product._id}`,
            method: 'PUT',
            headers: setHeaders(),
            data: {
                bought: false,
            }
        }).then(res => {
            if (res.status === 200) {
                this.showShoppingList();
            } else {
                console.log('warrning');
            }
        },
            error => {
                console.log(error);
            }
        );})
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
        this.showShoppingList();
    }

    render() {
        return (
            <div className="container-products">
                <div className="containerMenu">
                    <button className="button" onClick={this.openNewProductForm}><TiPlus/></button>
                    <button className="button" onClick={this.openNewUserForm}><TiUserAdd/></button>
                    <button className="button" onClick={this.showShoppingListMembers}><TiGroup/></button>
                    <button className="button" onClick={this.resetShoppingList}><TiArrowSync/></button>
                    <Link className="button" to={ this.state.members.length > 1 ? `/commonShoppingLists` : `/shoppingLists` }><TiArrowBack/></Link>
                </div>
                {this.state.addProductActive ? <AddProduct onClick={this.showShoppingList} id={this.state.idShoppingList} /> : null}
                {this.state.addUserActive ? <AddUserToShoppingList onClick={this.openNewUserForm} id={this.state.idShoppingList} />  : null}
                {this.state.showShoppingListMembers ? <ShowShoppingListMembers onClick={this.showShoppingList} id={this.state.idShoppingList} membersIds={this.state.members}/>  : null}
                <ProgressBar allProducts={this.state.products} onChange={this.showShoppingList}/>
                {this.state.products.map(product =>
                    <div key={product._id} className="container-product">
                        <div className="product-name" onClick={() => this.crossProduct(product.bought, product._id)}>
                            <p style={product.bought ? {textDecorationLine: 'line-through', color: 'green'} : null}>{product.name}</p>
                        </div>
                        <div className="product-number">
                            <p style={product.bought ? {textDecorationLine: 'line-through', color: 'green'} : null}>{product.amount}</p>
                        </div>
                        <div className="product-number">
                            <p style={product.bought ? {textDecorationLine: 'line-through', color: 'green'} : null}>{product.unit}</p>
                        </div>
                        <DeleteProductFromShoppingList onClick={this.showShoppingList} id={this.state.idShoppingList} idProd={product._id} />
                    </div>)}
            </div>
        );
    }
}

export default ShowShoppingList;