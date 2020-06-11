import {
    TYPES
} from '../redux_actions/types';

const initialState = {
    loginData: {
        email: '',
        password: '',
        emailVerified: true,
        invalidData: false
    },
    isLogged: localStorage.getItem("token") ? true : false,
    me: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TYPES.LOGIN:
            return {
                ...state,
                loginData: action.loginData,
                isLogged: action.isLogged,
            };
        case TYPES.LOGOUT:
            return {
                ...state,
                isLogged: action.isLogged,
            };
        case TYPES.GETMYDATA:
            return {
                ...state,
                me: action.me,
            };
        default:
            return state;
    }
}