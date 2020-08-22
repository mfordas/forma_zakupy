import React, { useState, useEffect } from 'react';
import { TiBell } from 'react-icons/ti';

import Notification from './notification';

import '../../main_styling/main_styling.scss';

const notificationsArray = [
    {
        actionCreator: 'Marta',
        action: 'dodała Cię do listy zakupów',
        readByUser: false,
    },
    {
        actionCreator: 'Lidl',
        action: 'została ukończona',
        readByUser: false,
    },
    {
        actionCreator: 'Mariusz',
        action: 'dodał Cię do listy zakupów',
        readByUser: true,
    },
    {
        actionCreator: 'Monika',
        action: 'dodała Cię do listy zakupów',
        readByUser: true,
    },
    {
        actionCreator: 'Jan',
        action: 'dodał Cię do listy zakupów',
        readByUser: true,
    },
]


const NotificationDataContent = () => {
    const [showNotifications, showHideNotifications] = useState(false);
    const [notificationCounter, setCounter] = useState(5);
    const [notifications, getNotifications] = useState([]);

    const handlerNotificationCounter = () => setCounter(notificationCounter+1);

    const handlerNotification = () => getNotifications([...notificationsArray]);

    const handlerShowNotifications = () => showHideNotifications(!showNotifications);

    const handleReadNotification = (notification) => {
        notification.readByUser = true;
    }

    const generateNotificationList = () => {
        return notifications.map((notification, index) => <Notification 
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
    }, [])

    return (
        <>
            <div className="notificationBellContainer">
                <div className="notificationBellContent">
                    <div onClick={() => {handlerShowNotifications(); handlerNotificationCounter()}}>< TiBell /></div>
                    <div className="notificationBellCounter">{notificationCounter}</div>
                </div>
            </div>
            {showNotifications? <div className="notificationsListContainer">{generateNotificationList()}</div> : null }
        </>
    )
};

export default NotificationDataContent