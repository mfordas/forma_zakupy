import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, loginData, ...rest}) => {
  return <Route {...rest} render={props => (loginData.isLogged ? <Component {...props} /> : <Redirect to="/" />)} />;
};

const mapStateToProps = (state) => ({
  loginData: state.loginData,
});

PrivateRoute.propTypes = {
  loginData: PropTypes.object
}

export default connect(mapStateToProps, {})(PrivateRoute);