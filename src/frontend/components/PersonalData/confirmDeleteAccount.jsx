import React from 'react';
import { NavLink } from 'react-router-dom';
import Store from '../../../Store';
import '../../main_styling/main_styling.scss';

class ConfirmDeleteAccount extends React.Component {

    static contextType = Store;

    render() {
        return (
            <div className="container">
                <div className="registerCard">
                    <p>Konto usunięte. Dziękujęmy za używanie naszej aplikacji.</p>
                    <form>
                    <NavLink className="button" to="/home">Strona główna</NavLink>
                    </form>
                </div>
            </div>
        );
    }
}

export default ConfirmDeleteAccount;