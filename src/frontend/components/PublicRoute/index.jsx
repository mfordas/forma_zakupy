import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const PublicRoute = ({ component: Component,loginData,  ...rest }) => {
  return <Route {...rest} render={props => (loginData.isLogged ? <Redirect to="/" /> : <Component {...props} /> )} />;
};

const mapStateToProps = (state) => ({
  loginData: state.loginData,
});

PublicRoute.propTypes = {
  loginData: PropTypes.object
}

export default connect(mapStateToProps, {})(PublicRoute);