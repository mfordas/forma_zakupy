import {
    TYPES
} from '../redux_actions/types';

const initialState = {
    usersList: [],
    userInfo: {},
    userListsInfo: []
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
            case TYPES.SAVEUSERCHANGES:
                return {
                    ...state,
                    userInfo: action.userInfo
                };
            case TYPES.GETUSERLISTSINFO:
                return {
                    ...state,
                    userListsInfo: action.userListsInfo
                };
            default:
                return state;
    }
}