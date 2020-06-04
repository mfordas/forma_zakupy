import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Store from '../../../Store';

const Footer = () => {
    const { isLogged } = useContext(Store);

    return ( <div className="containerFooter">
        <div className="linkFooter">Copyright © <a href="https://formadietetyk.pl" target="_blank" rel='noreferrer'>FORMA Dietetyk Marta Fordas</a> 2020 </div>
        <div className="containerFooterHorizontal">
        {/* <NavLink className="linkFooter" to="/home">Polityka prywatności</NavLink> */}
    {!isLogged &&
        (
            <>
            </>
        )
        }
    {isLogged &&
    (
        <>
        <NavLink className="linkFooter" to="/personalData">Moje dane</NavLink>
        </>
    )}
        </div></div>
    )

}


export default Footer;

