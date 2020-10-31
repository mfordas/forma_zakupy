import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import nock from 'nock';

import {
  deleteAccount,
  resetPersonalDataState
} from "../personalDataActions";
import {
  TYPES
} from "../types";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store;
const userId = 123456789;

describe("personal data actions ", () => {
  beforeEach(() => {
  })
  afterEach(() => {
    store.clearActions();
  });

  it("delete user account", async () => {
    store = mockStore({
      accountDeleted: false
    });

    nock(`http://localhost/api/users`)
    .delete(`/${userId}`)
    .reply(200);

    const expectedActions = [{
      type: TYPES.DELETEACCOUNT,
      accountDeleted: true
    }];

    localStorage.setItem('id', userId);

    await store.dispatch(deleteAccount());

    expect(store.getActions()).toEqual(expectedActions);
  });

  it("should reset personal data reducer state", async () => {
    store = mockStore({
      accountDeleted: true
    });

    const expectedActions = [{
      type: TYPES.RESETPERSONALDATASTATE,
      accountDeleted: false
    }];

    await store.dispatch(resetPersonalDataState());

    expect(store.getActions()).toEqual(expectedActions);
  });
  
});