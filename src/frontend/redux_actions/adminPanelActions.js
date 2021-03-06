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

export const getUserInfo = (id) => async (dispatch) => {
    if (id !== undefined) {
        try {
            const res = await axios({
                url: `/api/users/byIdAdmin/${id}`,
                method: "GET",
                headers: setHeaders()
            });

            if (res.status === 200) {
                dispatch({
                    type: TYPES.GETUSERINFO,
                    userInfo: res.data
                });
            }

        } catch (error) {
            console.log(error)
        }
    } else {
        return console.log('Id undefined');
    }

};

export const getUserShoppingListsInfo = (listsArray) => async (dispatch) => {
    if (listsArray !== undefined || listsArray.length > 0) {
        try {
            await Promise.all(listsArray.map(async listId => (await axios({
                            url: `/api/shoppingLists/${listId}`,
                            method: 'GET',
                            headers: setHeaders()
                        }

                    )
                    .then(res => res.data))))
                .then(res =>
                    dispatch({
                        type: TYPES.GETUSERLISTSINFO,
                        userListsInfo: res
                    }))

        } catch (error) {
            console.log(error)
        }
    } else {
        return console.log('Id undefined');
    }

};

export const saveUserChanges = (id, userData) => async (dispatch) => {
    if (id !== undefined) {
        try {
            const res = await axios({
                url: `/api/users/byId/${id}`,
                method: "PUT",
                headers: setHeaders(),
                data: {
                    isAdmin: userData.isAdmin,
                    isVerified: userData.isVerified,
                }
            });

            if (res.status === 200) {
                dispatch({
                    type: TYPES.SAVEUSERCHANGES,
                    userInfo: res.data
                });
            }

        } catch (error) {
            console.log(error)
        }
    } else {
        return console.log('Id undefined');
    }

};