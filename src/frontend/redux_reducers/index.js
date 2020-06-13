import {combineReducers} from 'redux';
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';
import personalDataReducer from './personalDataReducer';

export default combineReducers({
  loginData: loginReducer,
  registerData: registerReducer,
  personalData: personalDataReducer,
});
