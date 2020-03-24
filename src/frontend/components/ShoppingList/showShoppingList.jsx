import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import AddProduct from './addProduct';
import DeleteProductFromShoppingList from './deleteProducFromShoppingList'
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
        this.setState({products: productsArray});
    }

    componentDidMount(){
        this.showShoppingList();
    }

    openNewProductForm = () => {
        this.setState({addProductActive: !this.state.addProductActive});
    }

    render() {
        return (
            <div className="container-products">
                <div className="containerMenu">
                <button className="button" onClick={this.openNewProductForm}>Dodaj produkt</button>
                <Link className="button" to={`/shoppingLists`}>Powrót do list zakupów</Link>
                </div>
                {this.state.addProductActive ? <AddProduct onClick={this.showShoppingList} id={this.state.idShoppingList}/> : null}
                {this.state.products.map(product =>
                    <div key={product._id} className="container-shoppingList">
                        <div className="shoppinglist-name">
                            <p>{product.name}</p>
                        </div>
                        <div className="shoppinglist-productsNumber">
                            <p>{product.amount}</p>
                        </div>
                        <div className="shoppinglist-productsNumber">
                            <p>{product.unit}</p>
                        </div>
                        <DeleteProductFromShoppingList onClick={this.showShoppingList} id={this.state.idShoppingList} idProd={product._id}/>
                    </div>)}
            </div>
        );
    }
}

export default ShowShoppingList;