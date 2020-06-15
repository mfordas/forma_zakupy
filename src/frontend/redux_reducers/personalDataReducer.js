import {
    TYPES
} from '../redux_actions/types';

const initialState = {
    accountDeleted: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TYPES.DELETEACCOUNT:
            return {
                ...state,
                accountDeleted: action.accountDeleted,
            };
            case TYPES.RESETPERSONALDATASTATE:
                return {
                    ...state,
                    accountDeleted: action.accountDeleted
                }
            default:
                return state;
    }
}