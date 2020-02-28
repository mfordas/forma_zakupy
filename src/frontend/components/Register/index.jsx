import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import Register from './register';

const RegisterContent = () => {
  return (
    <BrowserRouter>
        <Switch>
          <Route exact path="/register" component={Register} />
        </Switch>
    </BrowserRouter>
  );
};

export default RegisterContent;
