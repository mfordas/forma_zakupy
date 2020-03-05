import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Store from '../../../Store';

const Menu = () => {
    const { isLogged, changeStore } = useContext(Store);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        changeStore('isLogged', false);
        changeStore('hasCharacter', null)
        window.location.reload();
    };

    return ( <div className="containerMenu">
    {!isLogged &&
        (
            <>
                <NavLink className="buttonMenu" to="/home">Logowanie</NavLink>
                <NavLink className="buttonMenu" to="/register">Rejestracja</NavLink>
            </>
        )
        }
    {isLogged &&
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


export default Menu;

