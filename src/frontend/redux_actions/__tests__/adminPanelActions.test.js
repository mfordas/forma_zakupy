import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import nock from 'nock';

import {
    getUserInfo,
    getUsersList,
    getUserShoppingListsInfo,
    deleteUserAccount,
    saveUserChanges,
} from "../adminPanelActions";
import {
    TYPES
} from "../types";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store;
const userId = 123456789;

describe("admin panel actions ", () => {
    beforeEach(() => {
        store = mockStore({
            usersList: [],
            userInfo: {
                isAdmin: false,
                isVerified: false,
            },
            userListsInfo: []
        });
    })
    afterEach(() => {
        store.clearActions();
    });

    it("should get user info", async () => {
        nock(`http://localhost/api/users`)
            .get(`/byIdAdmin/${userId}`)
            .reply(200, {
                name: 'Endrju',
                shoppingLists: [1, 2, 3,],
            });

        const expectedActions = [{
            type: TYPES.GETUSERINFO,
            userInfo: {
                name: 'Endrju',
                shoppingLists: [1, 2, 3,],
            },
        }];

        await store.dispatch(getUserInfo(userId));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it("should get users lists", async () => {
        nock(`http://localhost/api`)
            .get(`/users`)
            .reply(200, [1, 2, 3, 4, 5]);

        const expectedActions = [{
            type: TYPES.GETUSERSLIST,
            usersList: [1, 2, 3, 4, 5],
        }];

        await store.dispatch(getUsersList());

        expect(store.getActions()).toEqual(expectedActions);
    });

    it("should delete user account", async () => {
        nock(`http://localhost/api/users`)
            .delete(`/${userId}`)
            .reply(200);

        const expectedActions = [{
            type: TYPES.DELETEUSERACCOUNT,
            accountDeleted: true,
        }];

        await store.dispatch(deleteUserAccount(userId));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it("should get user shopping lists info", async () => {
        const userShoppingListsIds = [1, 2, 3];

        nock(`http://localhost/api/shoppingLists`)
            .get(`/1`)
            .reply(200, {
                name: 'Lidl',
            }, );
        nock(`http://localhost/api/shoppingLists`)
            .get(`/2`)
            .reply(200, {
                name: 'Biedronka',
            }, );
        nock(`http://localhost/api/shoppingLists`)
            .get(`/3`)
            .reply(200, {
                name: 'Tesco',
            }, );

        const expectedActions = [{
            type: TYPES.GETUSERLISTSINFO,
            userListsInfo: [{
                    name: 'Lidl',
                },
                {
                    name: 'Biedronka',
                },
                {
                    name: 'Tesco',
                },
            ],
        }];

        await store.dispatch(getUserShoppingListsInfo(userShoppingListsIds));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it("should change user account settings", async () => {
        const userData =  {
            isAdmin: true,
            isVerified: true,
        };

        nock(`http://localhost/api/users`)
            .put(`/byId/${userId}`, )
            .reply(200, {
                isAdmin: true,
                isVerified: true
            }, );
        

        const expectedActions = [{
            type: TYPES.SAVEUSERCHANGES,
            userInfo: {
                isAdmin: true,
                isVerified: true,
            }
        }];

        await store.dispatch(saveUserChanges(userId, userData));

        expect(store.getActions()).toEqual(expectedActions);
    });

});