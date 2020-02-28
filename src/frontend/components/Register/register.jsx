import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Store from '../../../Store';
import axios from 'axios';
import './register.scss';

class Login extends React.Component {

  state = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    emailTaken: false,
  }

  static contextType = Store;

  postUser = async () => {
    try {
      if (this.state.password !== this.state.confirmPassword) {
        throw 'Both passwords must be the same';
      }
      console.log(this.state);
      const res = await axios({
        method: 'post',
        url: '/api/users',
        data: {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (res.status === 200) {
        document.location.href = '/register/confirm';
      } else {
        this.setState({ invalidData: true });
      }
    }
    catch (error) {
      console.error('Error Registration:', error);
      this.setState({ invalidData: true });
    }
  }

  checkEmail = async () => {
    await axios({
      url: '/api/users',
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      response.data.forEach((data) => {
        if (data.email === this.state.email) {
          this.setState({ emailTaken: true })
        }
      })
    }, (error) => {
      console.log(error);
    });
  }

  onButtonSubmit = async e => {
    e.preventDefault();
    console.log('aaaaa');
    this.setState({ emailTaken: false })
    // await this.checkEmail();
    if (this.state.emailTaken === false) {
      this.postUser();
    }
  }

  nameValidate = (e) => {
    if (this.state.name.length < 3 && this.state.invalidData) {
      return console.log('Errror');
    }
    else { return null }
  }

  emailValidate = (e) => {
    if (this.state.emailTaken === true) {
      return console.log('Errror');
    }
    else { return null }
  }

  passwordValidate = (e) => {
    if ((this.state.password !== this.state.confirmPassword) && this.state.invalidData) {
      return console.log('Errror');
    }
    else if ((this.state.password.length < 8 || this.state.confirmPassword.length < 8) && this.state.invalidData) {
      return console.log('Errror');
    }
    else { return null }
  }

  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <div className="registerCard">
            <p>Witamy w programie Forma Zakupy. Jeśli jeszcze nie posiadasz konta - zarejestruj się</p>
            <form>
              <p>Name</p>
              <input onChange={e => this.setState({ name: e.target.value })}></input>
              <p>Email</p>
              <input onChange={e => this.setState({ email: e.target.value })}></input>
              <p>Password</p>
              <input onChange={e => this.setState({ password: e.target.value })}></input>
              <p>Confirm password</p>
              <input onChange={e => this.setState({ confirmPassword: e.target.value })}></input>
              <button onClick={this.onButtonSubmit}>Confirm</button>
            </form>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default Login;