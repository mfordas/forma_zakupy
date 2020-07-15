import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addProductToList, showProductsProposals, showShoppingList, resetProductsProposals } from '../../redux_actions/shoppingListActions';
import '../../main_styling/main_styling.scss';

class AddProduct extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            productName: '',
            productAmount: 0,
            productUnit: 'kg',
        }
    };

    addProductToList = async () => {
        await this.props.addProductToList(this.props.shoppingListsData.shoppingListInfo.idShoppingList, this.state);
        await this.props.showShoppingList(this.props.shoppingListsData.shoppingListInfo.idShoppingList);
    }

    componentWillUnmount () {
        this.props.resetProductsProposals();
    }

    render() {
        return (
            <div className="container-add-shoppingList">
                <div className="horizontalFormContainer">
                    <p>Nazwa</p>
                    <input list="productsProposals" onClick={(e) => e.target.value =''} onChange={e => {
                        this.setState({ productName: e.target.value }, () => this.props.showProductsProposals(this.state.productName));
                    }} />
                    <datalist id="productsProposals">
                        {this.props.shoppingListsData.productsProposals.map(product => <option key={product._id} value={product.name} />)}
                    </datalist>
                </div>
                <div className="horizontalFormContainer">
                    <p >Ilość</p>
                    <input style={{ maxWidth: '50px' }} onClick={(e) => e.target.value =''} onChange={e => this.setState({ productAmount: e.target.value })}></input>
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

const mapStateToProps = (state) => ({
    shoppingListsData: state.shoppingListsData,
});

AddProduct.propTypes = {
    shoppingListsData: PropTypes.object
}

export default connect(mapStateToProps, { addProductToList, showProductsProposals, showShoppingList, resetProductsProposals })(AddProduct);