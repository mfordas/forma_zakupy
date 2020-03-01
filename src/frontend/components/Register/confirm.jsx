import React from 'react';
import { NavLink } from 'react-router-dom';
import Store from '../../../Store';
import '../../main_styling/main_styling.scss';

class Confirm extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            name: this.props.name,
            email: this.props.email,
        }
    }


    static contextType = Store;

    render() {
        return (
            <div className="container">
                <div className="registerCard">
                    <p>{this.state.name}, dziękujemy za rejestrację! Na adres: {this.state.email} została wysłana wiadomość z linkiem aktywującym konto. Jeśli wiadomości nie ma w wiadomościach odebranych, sprawdź także SPAM.</p>
                    <form>
                    <NavLink className="button" to="/home">Strona główna</NavLink>
                    </form>
                </div>
            </div>
        );
    }
}

export default Confirm;