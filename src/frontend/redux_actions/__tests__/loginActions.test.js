import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import nock from 'nock';

import * as loginActions from "../loginActions";
import {
  TYPES
} from "../types";

jest.mock('jwt-decode', () => () => ({ }));
jest.mock('../../utils/generateAuthTokenForExternalUser', () => () => ({ }));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let store;
const loginDataFromUser = {
  email: 'sample@email.com',
  password: '123456'
};

const invalidLoginDataFromUser = {
  email: 'sample@email.com',
};

describe("login actions ", () => {
  beforeEach(() => {})
  afterEach(() => {
    store.clearActions();
  });

  it("should succesfuly login user", async () => {
    store = mockStore({
      loginData: {
        email: '',
        password: '',
        emailVerified: true,
        invalidData: false
      },
      isLogged: false,
      createNewExternalUser: false,
      newExternalUserData: {},
      me: {}
    });

    nock(`http://localhost/api`)
      .post(`/auth`)
      .reply(200);

    const expectedActions = [{
      type: TYPES.LOGIN,
      isLogged: true
    }];

    await store.dispatch(loginActions.login(loginDataFromUser));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it("should set that email is not verified", async () => {
    store = mockStore({
      loginData: {
        email: '',
        password: '',
        emailVerified: true,
        invalidData: false
      },
      isLogged: false,
      createNewExternalUser: false,
      newExternalUserData: {},
      me: {}
    });

    nock(`http://localhost/api`)
      .post(`/auth`)
      .reply(203);

    const expectedActions = [{
      type: TYPES.LOGIN,
      loginData: {
        emailVerified: false,
        invalidData: true
      },
    }];

    await store.dispatch(loginActions.login(loginDataFromUser));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it("should send error code if login data is wrong", async () => {
    store = mockStore({
      loginData: {
        email: '',
        password: '',
        emailVerified: true,
        invalidData: false
      },
      isLogged: false,
      createNewExternalUser: false,
      newExternalUserData: {},
      me: {}
    });

    nock(`http://localhost/api`)
      .post(`/auth`)
      .reply(400);

    const expectedActions = [{
      type: TYPES.LOGIN,
      loginData: {
        emailVerified: true,
        invalidData: true
      },
    }];

    await store.dispatch(loginActions.login(loginDataFromUser));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it("should succesfuly create external user", async () => {
    store = mockStore({
      loginData: {
        email: '',
        password: '',
        emailVerified: true,
        invalidData: false
      },
      isLogged: false,
      createNewExternalUser: false,
      newExternalUserData: {},
      me: {}
    });

    nock(`http://localhost/api`)
      .post(`/authexternal`)
      .reply(202);

    const expectedActions = [{
      type: TYPES.LOGINEXTERNAL,
      isLogged: false,
      createNewExternalUser: true,
    }];

    await store.dispatch(loginActions.loginExternal(loginDataFromUser));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it("should succesfuly login external user", async () => {
    store = mockStore({
      loginData: {
        email: '',
        password: '',
        emailVerified: true,
        invalidData: false
      },
      isLogged: false,
      createNewExternalUser: false,
      newExternalUserData: {},
      me: {}
    });

    nock(`http://localhost/api`)
      .post(`/authexternal`)
      .reply(200);

    const expectedActions = [{
      type: TYPES.LOGINEXTERNAL,
      isLogged: true
    }];

    await store.dispatch(loginActions.loginExternal(loginDataFromUser));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should succesfully logout user', () => {
    store = mockStore({
      loginData: {
        email: '',
        password: '',
        emailVerified: true,
        invalidData: false
      },
      isLogged: true,
      createNewExternalUser: false,
      newExternalUserData: {},
      me: {}
    });

    const expectedActions = [{
      type: TYPES.LOGOUT,
      loginData: {
        email: '',
        password: '',
        emailVerified: true,
        invalidData: false
      },
      isLogged: false,
      me: {}
    }];

    store.dispatch(loginActions.logout());

    expect(store.getActions()).toEqual(expectedActions);

  });

  it("should get user data", async () => {
    store = mockStore({
      loginData: {
        email: '',
        password: '',
        emailVerified: true,
        invalidData: false
      },
      isLogged: false,
      createNewExternalUser: false,
      newExternalUserData: {},
      me: {}
    });

    nock(`http://localhost/api`)
      .get(`/users/me`)
      .reply(200, {
        name: 'User1',
        email: 'user1@email.com'
      });

    const expectedActions = [{
      type: TYPES.GETMYDATA,
      isLogged: true,
        me: {
          name: 'User1',
          email: 'user1@email.com'
        },
    }];

    await store.dispatch(loginActions.myData());

    expect(store.getActions()).toEqual(expectedActions);
  });

  it("should return error if there was bad request", async () => {
    store = mockStore({
      loginData: {
        email: '',
        password: '',
        emailVerified: true,
        invalidData: false
      },
      isLogged: true,
      createNewExternalUser: false,
      newExternalUserData: {},
      me: {}
    });

    nock(`http://localhost/api`)
      .get(`/users/me`)
      .reply(400);

    const expectedActions = [];

    await store.dispatch(loginActions.myData());

    expect(store.getActions()).toEqual(expectedActions);
  });
});