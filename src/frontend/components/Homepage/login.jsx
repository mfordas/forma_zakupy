import React from 'react';
import { BrowserRouter, Redirect, NavLink } from 'react-router-dom';
import Store from '../../../Store';
import axios from 'axios';
import jwt from 'jwt-decode';
import './homepage.scss';

class Login extends React.Component {

  state = {
    email: '',
    password: '',
  }

  static contextType = Store;

  onButtonSubmit = async e => {
    e.preventDefault();
    const data = this.state;
    delete this.state["invalidData"];
    try {
      const res = await axios({
        method: 'post',
        url: '/api/auth',
        data: data,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(res.status);

      if(res.status === 203) {
        localStorage.setItem('email', this.state.email);
        document.location.href = '/login/notVerified';
      } else if (res.status === 200) {
        const token = res.headers["x-auth-token"];
        localStorage.setItem('token', token);
        localStorage.setItem('id', jwt(token)._id);
        this.context.changeStore('isLogged', true);
        this.setState({ isLogged: true });
      } else {
        this.setState({ invalidData: true });
      }
    }
    catch (error) {
      console.error('Error Login:', error);
      this.setState({ invalidData: true });
    }
  }

  loginValidate = (e) => {
    if (this.state.invalidData) {
      return console.log('Invalid email or password');
    }
    else { return null }
  }

  render() {
    if (this.context.isLogged) return <Redirect to="/" />;
  
    return (
      <BrowserRouter>
        <div className="container">
          <div className="registerCard">
            <p>Witamy w programie Forma Zakupy. Jeśli jeszcze nie posiadasz konta - zarejestruj się</p>
            <form>
              <input onChange={e => this.setState({ email: e.target.value })}></input>
              <p>E-mail</p>
              <input onChange={e => this.setState({ password: e.target.value })}></input>
              <p>Hasło</p>
              <button className="button" onClick={this.onButtonSubmit}>Zaloguj</button>
              <NavLink className="button" to="/home/register">Rejestracja</NavLink>
            </form>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default Login;