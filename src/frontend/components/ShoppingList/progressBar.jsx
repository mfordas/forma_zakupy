import React from 'react';
import '../../main_styling/main_styling.scss';

class ProgressBar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            percentOfCompletedProducts: 0,
            backgroundColor: null,
            width: 0
        }
    };


    countPercentage = async () => {
        let allProducts = this.props.allProducts.length;
        let boughtProducts = this.props.allProducts.length;
        await this.props.allProducts.map(product => {
            return product.bought ? null : --boughtProducts;
        });

        let percentage = Math.floor((boughtProducts / allProducts) * 100);
        if (isNaN(percentage)) {
            return 0;
        } else {
            this.setState({ percentOfCompletedProducts: percentage });
            this.stylingChange();
        }
    };

    stylingChange = () => {
        if (this.state.percentOfCompletedProducts <= 33) {
            return this.setState({ backgroundColor: 'red' ,
        width: `${this.state.percentOfCompletedProducts}%` });
        }
        else if (this.state.percentOfCompletedProducts <= 66 && this.state.percentOfCompletedProducts > 33) {
            return this.setState({ backgroundColor: 'orange',
            width: `${this.state.percentOfCompletedProducts}%`});
        }
        else if (this.state.percentOfCompletedProducts > 66 && this.state.percentOfCompletedProducts < 100) {
            return this.setState({ backgroundColor: 'yellow',
            width: `${this.state.percentOfCompletedProducts}%`});
        }
        else if (this.state.percentOfCompletedProducts === 100) {
            return this.setState({ backgroundColor:'green' ,
            width: `${this.state.percentOfCompletedProducts}%`});
        }

    }

    componentDidMount() {
        this.countPercentage();
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.allProducts) !== JSON.stringify(prevProps.allProducts)) {
            this.countPercentage();
        }
    };

    render() {
        return (
            <div className="progress-bar-container">
                <div className="progress-bar" style={{backgroundColor:this.state.backgroundColor, width: this.state.width}} >{this.state.percentOfCompletedProducts}%</div>
            </div>
        );
    };
}

export default ProgressBar;