import React from 'react';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../redux_actions/loginActions';
import { resetPersonalDataState } from '../../redux_actions/personalDataActions';
import '../../main_styling/main_styling.scss';

class ConfirmDeleteAccount extends React.Component {

    componentDidMount() {
        this.props.logout();
    }

    render() {
        return (
            <div className="container">
                <div className="registerCard">
                    <p>Konto usunięte. Dziękujęmy za używanie naszej aplikacji.</p>
                    <form>
                    <NavLink className="button" to="/home" onClick={() => this.props.resetPersonalDataState()}>Strona główna</NavLink>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    loginData: state.loginData,
  });
  
  ConfirmDeleteAccount.propTypes = {
    loginData: PropTypes.object,
  }

  export default connect(mapStateToProps, { logout, resetPersonalDataState })(ConfirmDeleteAccount);
