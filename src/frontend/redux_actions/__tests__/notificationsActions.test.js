import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import nock from 'nock';

import {
  addNotification,
  getNotifications,
  readNotification

} from "../notificationsActions";
import {
  TYPES
} from "../types";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store;
const userId = 123456789;
const actionCreator = {name:'Lidl'};
const type = 'shoppinglist';

describe("notifications actions ", () => {
  beforeEach(() => {
  })
  afterEach(() => {
    store.clearActions();
  });

  it("should add new notification", async () => {
    store = mockStore({
        notificationAdded: false,
        notifications: [],
    });

    nock(`http://localhost/api/notifications`)
    .post(`/${userId}/notification`)
    .reply(200);

    const expectedActions = [{
      type: TYPES.ADDNOTIFICATION,
      notificationAdded: true,
    }];

    await store.dispatch(addNotification(userId, actionCreator, type));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it("should get all notifications for user", async () => {
    store = mockStore({
        notificationAdded: false,
        notifications: [],
    });

    nock(`http://localhost/api/notifications`)
    .get(`/${userId}`)
    .reply(200, [1,2,3,4,5]
    );

    const expectedActions = [{
      type: TYPES.GETNOTIFICATIONS,
      notifications: [1,2,3,4,5],
    }];

    localStorage.setItem('id', userId);

    await store.dispatch(getNotifications());

    expect(store.getActions()).toEqual(expectedActions);
  });

  it("should change notification status", async () => {
    store = mockStore({
        notificationAdded: false,
        notifications: [1,2,3,4,5],
    });

    const idNotification = 123456;

    nock(`http://localhost/api/notifications`)
    .put(`/${userId}/notification/${idNotification}`)
    .reply(200, { notifications: [6, 7, 8, 9, 10] }
    );

    const expectedActions = [{
      type: TYPES.READNOTIFICATION,
      notifications: [6, 7, 8, 9, 10],
    }];

    localStorage.setItem('id', userId);

    await store.dispatch(readNotification(idNotification));

    expect(store.getActions()).toEqual(expectedActions);
  });
});