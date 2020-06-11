import React from 'react';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import '../../main_styling/main_styling.scss';
import { resetRegisterState } from '../../redux_actions/registerActions';

class Confirm extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            name: this.props.name,
            email: this.props.email,
        }
    }

    render() {
        return (
            <div className="container">
                <div className="registerCard">
                    <p>{this.state.name}, dziękujemy za rejestrację! Na adres: {this.state.email} została wysłana wiadomość z linkiem aktywującym konto. Jeśli wiadomości nie ma w wiadomościach odebranych, sprawdź także SPAM.</p>
                    <form>
                    <NavLink className="button" to="/home" onClick={() => this.props.resetRegisterState()}>Strona główna</NavLink>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    registerData: state.registerData,
  });
  
  Confirm.propTypes = {
    registerData: PropTypes.object
  };
  
  export default connect(mapStateToProps, { resetRegisterState })(Confirm);