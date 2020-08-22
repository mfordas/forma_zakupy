import React from 'react';

import '../../main_styling/main_styling.scss';


const Notification = ({ actionCreator, action, readByUser, notificationAction }) => {
    return (
        <div className="notificationContainer" onClick={notificationAction}>
            {!readByUser ? <div className="notificationStatus"></div> : null }
            <div className="notificationActionCreator">{actionCreator}</div>
            <div className="notificationAction">{action}</div>
        </div>
    )
}

export default Notification