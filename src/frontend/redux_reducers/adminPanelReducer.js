import {
    TYPES
} from '../redux_actions/types';

const initialState = {
    usersList: [],
    userInfo: {}

};

export default function (state = initialState, action) {
    switch (action.type) {
        case TYPES.DELETEUSERACCOUNT:
            return {
                ...state,
                accountDeleted: action.accountDeleted,
            };
            case TYPES.GETUSERSLIST:
                return {
                    ...state,
                    usersList: action.usersList
                };
            case TYPES.GETUSERINFO:
                return {
                    ...state,
                    userInfo: action.userInfo
                };
            default:
                return state;
    }
}