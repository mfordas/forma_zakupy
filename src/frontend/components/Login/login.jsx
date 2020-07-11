import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import '../../main_styling/main_styling.scss';
import ErrorMessage from '../ReusableComponents/ErrorMessage';
import { login } from '../../redux_actions/loginActions';

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }
  }

  onButtonSubmit = async e => {
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password
    };
    await this.props.login(data);
  }

  loginValidate = (e) => {
    if (this.props.loginData.loginData.emailVerified === true && this.props.loginData.loginData.invalidData) {
      return <ErrorMessage message='Zły e-mail lub hasło' />
    }
    if (this.props.loginData.loginData.emailVerified === false && this.props.loginData.loginData.invalidData) {
      return <ErrorMessage message='Adres e-mail niezweryfikowany' />
    }
    else { return null }
  }

  render() {
    if (this.props.loginData.isLogged) return <Redirect to="/" />;

    return (
      <div className="container">
        <div className="registerCard">
          <p>Witamy w programie Forma Zakupy. Jeśli jeszcze nie posiadasz konta - zarejestruj się</p>
          <form>
            <input onChange={e => this.setState({ email: e.target.value.toLowerCase() })}></input>
            <p>E-mail</p>
            <input type="password" onChange={e => this.setState({ password: e.target.value })}></input>
            <p>Hasło</p>
            {this.loginValidate()}
            <button className="button" onClick={this.onButtonSubmit}>Zaloguj</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loginData: state.loginData,
});

Login.propTypes = {
  loginData: PropTypes.object
}

export default connect(mapStateToProps, { login })(Login);