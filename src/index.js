import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import {Provider} from 'react-redux';

import store from './frontend/redux_store/reduxStore'
import Home from "./frontend/views/Homepage";
import PublicRoute from "./frontend/components/PublicRoute";
import PrivateRoute from "./frontend/components/PrivateRoute";
import MenuBar from "./frontend/views/Menu";
import Login from "./frontend/views/Login";
import Register from "./frontend/views/Register";
import ShoppingList from "./frontend/views/ShoppingList";
import PersonalData from "./frontend/views/PersonalData";
import FooterBar from "./frontend/views/FooterBar";
import ConfirmDeleteAccount from "./frontend/components/PersonalData/confirmDeleteAccount";

import './frontend/main_styling/main_styling.scss';

const App = () => {
  // const { isLogged, changeStore } = useContext(Store);

  // useEffect(() => {
  //   if (!isLogged) return;
  //   (async () => {
  //     try {
  //       const response = await axios({
  //           url:  "/api/users/me",
  //           method: "GET",
  //           headers: setHeaders()
  //         }
  //         );
  //       if (response.status === 400) {
  //         localStorage.removeItem("token");
  //         changeStore("isLogged", false);
  //         changeStore("me", null);
  //         logout();
  //         return;
  //       }
  //       const data = await response.data;
  //       changeStore("isLogged", true);
  //       changeStore("me", data);
  //     } catch (ex) {
  //       console.error("Serwer nie odpowiada");
  //       console.error("Error", ex);
  //     }
  //   })();
  // }, [changeStore, isLogged]);

  return (
    <BrowserRouter>
    <div className="contentContainer">
      <Home />
      <MenuBar />
      <Switch>
      <PublicRoute exact path="/home" component={Login} />
      <PrivateRoute exact path="/shoppingLists" component={ShoppingList} />
      <PrivateRoute exact path="/commonShoppingLists" component={ShoppingList} />
      <PrivateRoute path="/shoppingList/:name" component={ShoppingList} />
      <PrivateRoute path="/personalData" component={PersonalData} />
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
    <App />
  </Provider>,
  document.querySelector("#root")
);


// const mapStateToProps = (state) => ({
//   loginData: state.loginData,
// });

// App.propTypes = {
//   loginData: PropTypes.object
// }

// export default connect(mapStateToProps, { logout })(App);