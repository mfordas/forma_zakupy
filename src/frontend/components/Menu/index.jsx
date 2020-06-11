import React from 'react';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { logout } from '../../redux_actions/loginActions';

const Menu = ({loginData, logout}) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        logout();
        window.location.reload();
    };

    return ( <div className="containerMenu">
    {!loginData.isLogged &&
        (
            <>
                <NavLink className="buttonMenu" to="/home">Logowanie</NavLink>
                <NavLink className="buttonMenu" to="/register">Rejestracja</NavLink>
            </>
        )
        }
    {loginData.isLogged &&
    (
        <>
        <NavLink className="buttonMenu" to="/shoppingLists">Moje Listy zakupów</NavLink>
        <NavLink className="buttonMenu" to="/commonShoppingLists">Wspólne listy zakupów</NavLink>
        <NavLink className="buttonMenu" to="/logout" onClick={handleLogout}>Wyloguj</NavLink>
        </>
    )}
        </div>
    )

}

const mapStateToProps = (state) => ({
    loginData: state.loginData,
  });
  
  Menu.propTypes = {
    loginData: PropTypes.object
  }
  
  export default connect(mapStateToProps, { logout })(Menu);
