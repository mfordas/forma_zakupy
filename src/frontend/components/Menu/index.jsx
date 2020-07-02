import React from 'react';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { logout, myData } from '../../redux_actions/loginActions';

const Menu = ({loginData, logout, myData}) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        logout();
        window.location.reload();
    };

    if(loginData.isLogged && JSON.stringify(loginData.me) === '{}'){
        myData();
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
  
  export default connect(mapStateToProps, { logout, myData })(Menu);
