import {combineReducers} from 'redux';
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';
import personalDataReducer from './personalDataReducer';
import shoppingListReducer from './shoppingListReducer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'


const shoppingListReducerConfig = {
  key: 'shoppingListData',
  storage: storage,
  whitelist: ['shoppingListInfo']
}

export default combineReducers({
  loginData: loginReducer,
  registerData: registerReducer,
  personalData: personalDataReducer,
  shoppingListsData: persistReducer(shoppingListReducerConfig, shoppingListReducer),
});
