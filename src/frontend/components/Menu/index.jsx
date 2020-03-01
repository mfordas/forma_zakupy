import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Store from '../../../Store';

const Menu = () => {
    const { isLogged, changeStore, me } = useContext(Store);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        changeStore('isLogged', false);
        changeStore('me', null);
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
        <NavLink className="buttonMenu" to="/home">Moje Listy zakupów</NavLink>
        <NavLink className="buttonMenu" to="/home/register">Wspólne listy zakupów</NavLink>
        <NavLink className="buttonMenu" to="/home/register">Wyloguj</NavLink>
        </>
    )}
        </div>
    )

}


export default Menu;

