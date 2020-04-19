import React from 'react';
import axios from 'axios';
import setHeaders from '../../utils/setHeaders';
import '../../main_styling/main_styling.scss';

class AddProduct extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            productName: '',
            productAmount: 0,
            productUnit: 'kg',
            idShoppingList: this.props.id,
            productAdded: null,
            productsProposals: []
        }
    }

    addProductToList = async () => {
        const id = this.state.idShoppingList;
        await axios({
            url: `/api/shoppingLists/${id}/product`,
            method: 'PUT',
            headers: setHeaders(),
            data: {
                name: this.state.productName,
                amount: this.state.productAmount,
                unit: this.state.productUnit
            }
        }).then(res => {
            if (res.status === 200) {

                this.setState({ productAdded: true });
            } else {
                this.setState({ productAdded: false });
            }
        },
            error => {
                console.log(error);
            }
        );

        this.props.onClick();

    };


    showProductsProposals = async (e) => {
        if (e.target.value.length >= 3) {
            let productsList = await axios({
                url: `/api/products/${e.target.value.toLowerCase()}`,
                method: 'GET',
                headers: setHeaders(),
                data: {
                    name: this.state.productName,
                    amount: this.state.productAmount,
                    unit: this.state.productUnit
                }
            });
            this.setState({ productsProposals: productsList.data });
        } else {this.setState({ productsProposals: [] });}
    }

    render() {
        return (
            <div className="container-add-shoppingList">
                <div className="horizontalFormContainer">
                <p>Nazwa</p>
                <input list="productsProposals" onChange={e => {
                    this.showProductsProposals(e);
                    this.setState({ productName: e.target.value })
                }} />
                <datalist id="productsProposals">
                    {this.state.productsProposals.map(product => <option key={product._id} value={product.name} />)}
                </datalist>
                </div>
                <div className="horizontalFormContainer">
                <p >Ilość</p>
                <input style={{maxWidth: '50px'}} onChange={e => this.setState({ productAmount: e.target.value })}></input>
                <select className="button" onChange={e => this.setState({ productUnit: e.target.value })}>
                    <option value='kg'>kg</option>
                    <option value='g'>g</option>
                    <option value='l'>l</option>
                    <option value='ml'>ml</option>
                    <option value='szt'>szt</option>
                </select>
                </div>
                <button className="button" onClick={this.addProductToList}>Dodaj</button>
            </div>
        );
    }
}

export default AddProduct;