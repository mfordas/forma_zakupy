import axios from 'axios';

import setHeaders from '../utils/setHeaders';
import notification from '../utils/notification';
import {
    TYPES
} from '../redux_actions/types';

export const addNotification = (user, actionCreator) => async (dispatch) => {
    try {
        const res = await axios({
            url: `/api/notifications/${user._id}/notification`,
            method: "POST",
            headers: setHeaders(),
            data: notification(actionCreator),
        });

        if (res.status === 200) {
            dispatch({
                type: TYPES.ADDNOTIFICATION,
                notificationAdded: true
            });
        }

    } catch (error) {
        console.log(error)
    }

};

export const getNotifications = () => async (dispatch) => {
    const id = localStorage.getItem('id');
    try {
        const res = await axios({
            url: `/api/notifications/${id}`,
            method: "GET",
            headers: setHeaders()
        });

        if (res.status === 200) {
            dispatch({
                type: TYPES.GETNOTIFICATIONS,
                notifications: res.data
            });
        }

    } catch (error) {
        console.log(error)
    }
};

export const readNotification = (idNotification) => async (dispatch) => {
    const id = localStorage.getItem('id');
    try {
        const res = await axios({
            url: `/api/notifications/${id}/notification/${idNotification}`,
            method: "PUT",
            headers: setHeaders()
        });

        if (res.status === 200) {
            dispatch({
                type: TYPES.READNOTIFICATION,
                notifications: res.data.notifications
            });
        }

    } catch (error) {
        console.log(error)
    }
};