import axios from 'axios';

import setHeaders from '../utils/setHeaders';
import {
    TYPES
} from '../redux_actions/types';

export const deleteAccount = () => async (dispatch) => {
    try {
        const id = localStorage.getItem('id');
        console.log('works1')
        const res = await axios({
            url: `/api/users/${id}`,
            method: "DELETE",
            headers: setHeaders()
        });

        console.log('works2')

        if (res.status === 200) {
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            dispatch({
                type: TYPES.DELETEACCOUNT,
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