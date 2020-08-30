import {combineReducers} from 'redux';
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';
import personalDataReducer from './personalDataReducer';
import shoppingListReducer from './shoppingListReducer';
import adminPanelReducer from './adminPanelReducer';
import notificationsReducer from './notificationsReducer';
import { persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session'


const shoppingListReducerConfig = {
  key: 'shoppingListData',
  storage: sessionStorage,
  whitelist: ['shoppingListInfo']
}

const adminPanelDataReducerConfig = {
  key: 'adminPanelData',
  storage: sessionStorage,
  whitelist: ['userInfo']
}

export default combineReducers({
  loginData: loginReducer,
  registerData: registerReducer,
  personalData: personalDataReducer,
  shoppingListsData: persistReducer(shoppingListReducerConfig, shoppingListReducer),
  adminPanelData: persistReducer(adminPanelDataReducerConfig, adminPanelReducer),
  notificationsData: notificationsReducer,
});
