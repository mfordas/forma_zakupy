import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TiArrowSync } from 'react-icons/ti';
import AddProduct from './addProduct';
import setHeaders from '../../utils/setHeaders';
import DeleteProductFromShoppingList from './deleteProducFromShoppingList';
import ProgressBar from './progressBar'
import '../../main_styling/main_styling.scss';

class ShowShoppingList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            products: [],
            name: props.location.listInfo.name,
            idShoppingList: props.location.listInfo.id,
            addProductActive: false,
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
        this.setState({ addProductActive: !this.state.addProductActive });
    }

    componentDidMount() {
        this.showShoppingList();
    }

    render() {
        return (
            <div className="container-products">
                <div className="containerMenu">
                    <button className="button" onClick={this.openNewProductForm}>Dodaj produkt</button>
                    <Link className="button" to={`/shoppingLists`}>Powrót do list zakupów</Link>
                    <button className="button" onClick={this.resetShoppingList}><TiArrowSync size="1.1rem" /></button>
                </div>
                {this.state.addProductActive ? <AddProduct onClick={this.showShoppingList} id={this.state.idShoppingList} /> : null}
                <ProgressBar allProducts={this.state.products} onChange={this.showShoppingList}/>
                {this.state.products.map(product =>
                    <div key={product._id} className="container-shoppingList">
                        <div className="shoppinglist-name" onClick={() => this.crossProduct(product.bought, product._id)}>
                            <p style={product.bought ? {textDecorationLine: 'line-through', color: 'green'} : null}>{product.name}</p>
                        </div>
                        <div className="shoppinglist-productsNumber">
                            <p>{product.amount}</p>
                        </div>
                        <div className="shoppinglist-productsNumber">
                            <p>{product.unit}</p>
                        </div>
                        <DeleteProductFromShoppingList onClick={this.showShoppingList} id={this.state.idShoppingList} idProd={product._id} />
                    </div>)}
            </div>
        );
    }
}

export default ShowShoppingList;