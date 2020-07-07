import axios from 'axios';

import setHeaders from '../utils/setHeaders';
import {
    TYPES
} from './types';

export const getUsersList = () => async (dispatch) => {
    try {
        const res = await axios({
            url: `/api/users`,
            method: "GET",
            headers: setHeaders()
        });

        if (res.status === 200) {
            dispatch({
                type: TYPES.GETUSERSLIST,
                usersList: res.data
            });
        }

    } catch (error) {
        console.log(error)
    }

};
export const deleteUserAccount = (id) => async (dispatch) => {
    try {
        const res = await axios({
            url: `/api/users/${id}`,
            method: "DELETE",
            headers: setHeaders()
        });

        if (res.status === 200) {
            dispatch({
                type: TYPES.DELETEUSERACCOUNT,
                accountDeleted: true
            });
        }

    } catch (error) {
        console.log(error)
    }

};

export const resetPersonalDataState = () => async (dispatch) => {
    dispatch({
        type: TYPES.RESETPERSONALDATASTATE,
        accountDeleted: false
    })
}