import React, { useState, useEffect } from 'react';

import '../../main_styling/main_styling.scss';

const GoogleAuth = () => {

    const [authObject, setAuthObject] = useState(null);
    const [isLogged, setStatus] = useState(false);

    useEffect(() => {

        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId: '',
                scope: 'email'
            }).then(() => {
                setAuthObject(window.gapi.auth2.getAuthInstance());
            }
            );
        });

    }, []);

    const makeAuth = async () => {
        await authObject.signIn();
        setStatus(authObject.isSignedIn.get());
    }

    const logOut = async () => {
        await authObject.signOut();
        setStatus(authObject.isSignedIn.get());
    }

    const checkData = () => {
        console.log(authObject.currentUser.get().getAuthResponse().id_token);
        console.log(authObject.currentUser.get().getBasicProfile());
    }

    const renderButton = () => {
        return !isLogged ? <div className="button" onClick={() => makeAuth()}>LogIn with Google Account</div> :  <div className="button" onClick={() => logOut()}>LogOut</div>
    }

    return (
        <>
            {renderButton()}           
            <div className="button" onClick={() => checkData()}>CheckData</div>
            <div className="button">{isLogged ? `${authObject.currentUser.get().getBasicProfile().getName()}` : `Niezalogowany`}</div>
        </>
    )
};

export default GoogleAuth
