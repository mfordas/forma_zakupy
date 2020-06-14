import {combineReducers} from 'redux';
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';
import personalDataReducer from './personalDataReducer';
import shoppingListReducer from './shoppingListReducer';

export default combineReducers({
  loginData: loginReducer,
  registerData: registerReducer,
  personalData: personalDataReducer,
  shoppingListsData: shoppingListReducer
});
