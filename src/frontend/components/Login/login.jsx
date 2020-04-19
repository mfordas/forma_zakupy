import React from 'react';
import { Redirect } from 'react-router-dom';
import Store from '../../../Store';
import axios from 'axios';
import jwt from 'jwt-decode';
import '../../main_styling/main_styling.scss';
import ErrorMessage from '../ReusableComponents/ErrorMessage';
import setHeaders from '../../utils/setHeaders';

class Login extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      email: '',
      password: '',
      emailVerified: true,
      invalidData: false
    }
  }
  

  static contextType = Store;

  onButtonSubmit = async e => {
    e.preventDefault();
    const data = {email: this.state.email,
      password:this.state.password};
    delete this.state["invalidData"];
    try {
      const res = await axios({
        method: 'post',
        url: '/api/auth',
        data: data,
        headers: setHeaders(),
      });
      console.log(res.status);

      if(res.status === 203) {
        localStorage.setItem('email', this.state.email);
        this.setState({emailVerified: false});
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
    if (this.state.emailVerified === true && this.state.invalidData) {
      return <ErrorMessage message='Zły e-mail lub hasło'/>
    }
    if (this.state.emailVerified === false && this.state.invalidData){
      return <ErrorMessage message='Adres e-mail niezweryfikowany'/>
    }
    else { return null }
  }

  render() {
    if (this.context.isLogged) return <Redirect to="/" />;
  
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

export default Login;