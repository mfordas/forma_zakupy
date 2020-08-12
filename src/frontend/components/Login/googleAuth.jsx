import React, { useState, useEffect } from 'react';

import '../../main_styling/main_styling.scss';

const GoogleAuth = () => {

    useEffect(() => {
        
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId: ,
                scope: 'email'
            });
        });
        
    }, []);

    const makeAuth = () => {
        const auth = window.gapi.auth2.getAuthInstance();
        auth.signIn();
    }

    return (
        <div className="button" onClick={makeAuth}>works</div>
    )
};

export default GoogleAuth
