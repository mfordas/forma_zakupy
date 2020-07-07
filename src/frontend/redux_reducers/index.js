import {combineReducers} from 'redux';
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';
import personalDataReducer from './personalDataReducer';
import shoppingListReducer from './shoppingListReducer';
import adminPanelReducer from './adminPanelReducer';
import { persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session'


const shoppingListReducerConfig = {
  key: 'shoppingListData',
  storage: sessionStorage,
  whitelist: ['shoppingListInfo']
}

export default combineReducers({
  loginData: loginReducer,
  registerData: registerReducer,
  personalData: personalDataReducer,
  shoppingListsData: persistReducer(shoppingListReducerConfig, shoppingListReducer),
  adminPanelData: adminPanelReducer, 
});
