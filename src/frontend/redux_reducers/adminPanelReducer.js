import {
    TYPES
} from '../redux_actions/types';

const initialState = {
    usersList: [],

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
                }
            default:
                return state;
    }
}