import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import nock from 'nock';

import * as registerActions from "../registerActions";
import {
  TYPES
} from "../types";

jest.mock('jwt-decode', () => () => ({}));
jest.mock('../../utils/generateAuthTokenForExternalUser', () => () => ({}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let store;
const registerDataFromUser = {
  name: 'sampleUser',
  email: 'sample@email.com',
  password: '123456'
};
const invalidRegisterDataFromUser = {
  name: 'sampleUser',
  email: 'sample@email.com',
};

describe("register actions ", () => {
  beforeEach(() => {})
  afterEach(() => {
    store.clearActions();
  });

  it("should succesfuly register user", async () => {
    store = mockStore({
      emailTaken: false,
      invalidData: false,
      confirm: false,
      googleUser: false,
    });

    nock(`http://localhost/api`)
      .post(`/users`)
      .reply(200);

    const expectedActions = [{
      type: TYPES.REGISTER,
      confirm: true,
    }];

    await store.dispatch(registerActions.postUser(registerDataFromUser));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it("should throw an error if data is wrong", async () => {
    store = mockStore({
      emailTaken: false,
      invalidData: false,
      confirm: false,
      googleUser: false,
    });

    nock(`http://localhost/api`)
      .post(`/users`)
      .reply(400);

    const expectedActions = [{
      type: TYPES.REGISTER,
      invalidData: true,
      confirm: false,
    }];

    await store.dispatch(registerActions.postUser(invalidRegisterDataFromUser));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it("should succesfuly register external user", async () => {
    store = mockStore({
      emailTaken: false,
      invalidData: false,
      confirm: false,
      googleUser: false,
    });

    nock(`http://localhost/api/users`)
      .post(`/googleUser`)
      .reply(200);

    const expectedActions = [{
      type: TYPES.REGISTEREXTERNAL,
      confirm: true,
      googleUser: true,
    }];

    await store.dispatch(registerActions.postGoogleUser(registerDataFromUser));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it("should throw an error if data is wrong", async () => {
    store = mockStore({
      emailTaken: false,
      invalidData: false,
      confirm: false,
      googleUser: false,
    });

    nock(`http://localhost/api/users`)
      .post(`/googleUser`)
      .reply(400);

    const expectedActions = [{
      type: TYPES.REGISTEREXTERNAL,
      invalidData: true,
            confirm: false,
            googleUser: true,
    }];

    await store.dispatch(registerActions.postGoogleUser(invalidRegisterDataFromUser));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it("should return true if email is taken", async () => {
    store = mockStore({
      emailTaken: false,
      invalidData: false,
      confirm: false,
      googleUser: false,
    });

    nock(`http://localhost/api/users`)
      .get(`/${registerDataFromUser.email}`)
      .reply(200, { emailTaken: true });

    const expectedActions = [{
      type: TYPES.CHECKEMAIL,
      emailTaken: true,
    }];

    await store.dispatch(registerActions.checkEmail(registerDataFromUser.email));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it("should return true if email is taken", async () => {
    store = mockStore({
      emailTaken: true,
      invalidData: false,
      confirm: false,
      googleUser: false,
    });

    nock(`http://localhost/api/users`)
      .get(`/${registerDataFromUser.email}`)
      .reply(200);

    const expectedActions = [{
      type: TYPES.CHECKEMAIL,
      emailTaken: false,
    }];

    await store.dispatch(registerActions.checkEmail(registerDataFromUser.email));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it("should reset reducer state", async () => {
    store = mockStore({
      emailTaken: true,
      invalidData: true,
      confirm: true,
      googleUser: true,
    });

    const expectedActions = [{
      type: TYPES.RESETREGISTERSTATE,
      emailTaken: false,
      invalidData: false,
      confirm: false,
      googleUser: false,
    }];

    await store.dispatch(registerActions.resetRegisterState());

    expect(store.getActions()).toEqual(expectedActions);
  });
});