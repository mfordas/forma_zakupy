import React from 'react';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const Footer = ({loginData}) => {

    return ( <div className="containerFooter">
        <div className="linkFooter">Copyright © <a target="_blank" rel="noopener noreferrer" href="https://formadietetyk.pl" >FORMA Dietetyk Marta Fordas</a> 2020 </div>
        <div className="containerFooterHorizontal">
        {/* <NavLink className="linkFooter" to="/home">Polityka prywatności</NavLink> */}
    {!loginData.isLogged &&
        (
            <>
            </>
        )
        }
    {loginData.isLogged &&
    (
        <>
        <NavLink className="linkFooter" to="/personalData">Moje dane</NavLink>
        </>
    )}
    {loginData.me.isAdmin &&
    (
        <>
        <NavLink className="linkFooter" to="/panelAdmina">Panel Admina</NavLink>
        </>
    )}
        </div></div>
    )

}


// export default Footer;

const mapStateToProps = (state) => ({
    loginData: state.loginData,
  });
  
  Footer.propTypes = {
    loginData: PropTypes.object
  }
  
  export default connect(mapStateToProps, {})(Footer);