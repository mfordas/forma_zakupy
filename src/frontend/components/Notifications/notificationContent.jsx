import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TiBell } from 'react-icons/ti';

import Notification from './notification';

import { addNotification, getNotifications, readNotification } from '../../redux_actions/notificationsActions';
import '../../main_styling/main_styling.scss';

const NotificationDataContent = ({ getNotifications, notificationsData, readNotification }) => {
    const [showNotifications, showHideNotifications] = useState(false);
    const [notificationCounter, setCounter] = useState(0);

    const handlerNotification = async () => {
        await getNotifications();
    }

    const handlerShowNotifications = () => showHideNotifications(!showNotifications);

    const handleReadNotification = async (notification) => {
        await readNotification(notification._id);
        await getNotifications();
    }

    const generateNotificationList = () => {
        return notificationsData.notifications.map((notification, index) => <Notification 
        key={index} 
        actionCreator={notification.actionCreator} 
        action={notification.action}
        readByUser={notification.readByUser}
        notificationAction={() => handleReadNotification(notification)} />);
    };

    useEffect(() => {
        const getNotificationsFromDataBase = async () => {
             await handlerNotification();
        };

        getNotificationsFromDataBase();
    }, []);

    useEffect(() => {
        let unReadNotifications = notificationsData.notifications.length;
        notificationsData.notifications.map(notification => notification.readByUser ? --unReadNotifications : null);
        setCounter(unReadNotifications);
    }, [notificationCounter, notificationsData.notifications])

    return (
        <>
            <div className="notificationBellContainer">
                <div className="notificationBellContent">
                    <div onClick={() => {handlerShowNotifications()}}>< TiBell /></div>
                    <div className="notificationBellCounter">{notificationCounter}</div>
                </div>
            </div>
            {showNotifications? <div className="notificationsListContainer">{generateNotificationList()}</div> : null }
        </>
    )
};

const mapStateToProps = (state) => ({
    notificationsData: state.notificationsData,
});

NotificationDataContent.propTypes = {
    notificationsData: PropTypes.object
}

export default connect(mapStateToProps, { addNotification, getNotifications, readNotification })(NotificationDataContent);
