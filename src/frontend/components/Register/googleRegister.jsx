import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import '../../main_styling/main_styling.scss';
import googlelogo from '../../img/g-logo.png';
import { postGoogleUser } from '../../redux_actions/registerActions';

const GoogleRegister = ({ postGoogleUser }) => {

    const [authObject, setAuthObject] = useState(null);

    useEffect(() => {
      
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId: process.env.REACT_APP_GOOGLE_AUTH_API_CLIENTID,
                scope: 'email'
            }).then(() => {
                setAuthObject(window.gapi.auth2.getAuthInstance());
            }
            );
        });
    }, []);

    const makeAuth = async () => {
        try{
        await authObject.signIn();
        await postGoogleUser(authObject);
    } catch (err) {
        console.log(err);
    }
    }

    return (
        <div className="googleButton" onClick={() => makeAuth()}>
            <img className="googleButtonLogo" src={googlelogo} alt='google logo' />
            <div className="googleButtonText">Zarejestruj przez Google</div>
        </div>

    )
};

const mapStateToProps = (state) => ({
    loginData: state.loginData,
});

GoogleRegister.propTypes = {
    loginData: PropTypes.object
}

export default connect(mapStateToProps, { postGoogleUser })(GoogleRegister);

