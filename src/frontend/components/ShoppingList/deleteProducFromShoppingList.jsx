import React from 'react';
import axios from 'axios';
import setHeaders from '../../utils/setHeaders';
import '../../main_styling/main_styling.scss';

class DeleteProductFromShoppingList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            idProduct: this.props.idProd,
            productDeleted: null,
            idShoppingList: this.props.id
        }
    }


    deleteProduct = async () => {
        const id = this.state.idShoppingList;
        const idProd = this.state.idProduct;
        await axios({
            url: `/api/shoppingLists/${id}/product/${idProd}`,
            method: "DELETE",
            headers: setHeaders()
        }).then(res => {
            if (res.status === 200) {
                this.setState({ productDeleted: true});
              } else {
                this.setState({ productDeleted: false });
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
                <button className="button" onClick={this.deleteProduct}>Usuń</button>
        );
    }
}

export default DeleteProductFromShoppingList;