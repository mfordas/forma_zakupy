import React, { useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Store, { StoreProvider } from './Store';
import setHeaders from './frontend/utils/setHeaders';
import Home from './frontend/views/Homepage';
import PublicRoute from './frontend/components/PublicRoute';
import MenuBar from './frontend/views/Menu';
import Login from './frontend/views/Login';
import Register from './frontend/views/Register';

const App = () => {
  const { isLogged, changeStore } = useContext(Store);

  useEffect(() => {
    if (!isLogged) return;
    (async () => {
      try {
        const response = await fetch('/api/users/me', setHeaders());
        if (response.status === 400) {
          localStorage.removeItem('token');
          changeStore('isLogged', false);
          changeStore('me', null);
          return;
        }
        const data = await response.json();
        changeStore('isLogged', true);
        changeStore('me', data);
      } catch (ex) {
        console.error('Serwer nie odpowiada');
        console.error('Error', ex);
      }
    })();
  }, [changeStore, isLogged]);

  

  return (
    <BrowserRouter>
        <Home/>
        <MenuBar />
        <Switch>
          <PublicRoute exact path="/home" component={Login}/>
          <Route exact path="/register" component={Register} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
    </BrowserRouter>
  );
};


ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.querySelector('#root'),
  
);
