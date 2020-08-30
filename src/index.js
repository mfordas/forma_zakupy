import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'

import {store, persistor } from './frontend/redux_store/reduxStore'
import Home from "./frontend/views/Homepage";
import PublicRoute from "./frontend/components/PublicRoute";
import PrivateRoute from "./frontend/components/PrivateRoute";
import MenuBar from "./frontend/views/Menu";
import Login from "./frontend/views/Login";
import Register from "./frontend/views/Register";
import ShoppingList from "./frontend/views/ShoppingList";
import PersonalData from "./frontend/views/PersonalData";
import AdminPanel from "./frontend/views/AdminPanel";
import FooterBar from "./frontend/views/FooterBar";
import ConfirmDeleteAccount from "./frontend/components/PersonalData/confirmDeleteAccount";
import Notification from './frontend/views/Notification';

import './frontend/main_styling/main_styling.scss';

const App = () => {

  return (
    <BrowserRouter>
    <div className="contentContainer">
      <Notification />
      <Home />
      <MenuBar />
      <Switch>
      <PublicRoute exact path="/home" component={Login} />
      <PrivateRoute exact path="/shoppingLists" component={ShoppingList} />
      <PrivateRoute exact path="/commonShoppingLists" component={ShoppingList} />
      <PrivateRoute path="/shoppingList/:name" component={ShoppingList} />
      <PrivateRoute path="/personalData" component={PersonalData} />
      <PrivateRoute path="/adminPanel" component={AdminPanel} />
      <PrivateRoute path="/adminPanel/:id" component={AdminPanel} />
      <PublicRoute exact path="/register" component={Register} />
      <Route path="/confirmDeleteAccount" component={ConfirmDeleteAccount} />
      <Route path="/register/verification/:token" component={Register} />
      <Route render={() => <Redirect to="/" />} />
      </Switch>
      </div>
      <FooterBar />
    </BrowserRouter>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
  </Provider>,
  document.querySelector("#root")
);