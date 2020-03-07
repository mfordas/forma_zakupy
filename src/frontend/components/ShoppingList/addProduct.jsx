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
            productAdded: null
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

                this.setState({ productAdded: true});
              } else {
                this.setState({ productAdded: false });
              }
            },
            error => {
              console.log(error);
            }
        );

        this.props.onClick();

    }

    render() {
        return (
            <div className="container-add-shoppingList">
                <p>Nazwa produktu</p>
                <input onChange={e => this.setState({ productName: e.target.value })}></input>
                <p>Ilość</p>
                <input onChange={e => this.setState({ productAmount: e.target.value })}></input>
                <select className="button" onChange={e => this.setState({ productUnit: e.target.value })}>
                    <option value='kg'>kg</option>
                    <option value='g'>g</option>
                    <option value='l'>l</option>
                    <option value='ml'>ml</option>
                    <option value='szt'>szt</option>
                </select>
                <button className="button" onClick={this.addProductToList}>Dodaj</button>
                </div>
        );
    }
}

export default AddProduct;