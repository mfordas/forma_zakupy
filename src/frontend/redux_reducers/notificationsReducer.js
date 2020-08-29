import {
    TYPES
} from '../redux_actions/types';

const initialState = {
    notificationAdded: false,
    notifications: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TYPES.ADDNOTIFICATION:
            return {
                ...state,
                notificationAdded: action.notificationAdded,
            };
        case TYPES.GETNOTIFICATIONS:
            return {
                ...state,
                notifications: action.notifications
            };
        case TYPES.READNOTIFICATION:
            return {
                ...state,
                notifications: action.notifications
            };
            default:
                return state;
    }
}