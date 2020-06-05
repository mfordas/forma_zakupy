import React from 'react';
import Store from '../../../Store';
import axios from 'axios';
import setHeaders from '../../utils/setHeaders';
import '../../main_styling/main_styling.scss';
import Confirm from './confirm';
import ErrorMessage from '../ReusableComponents/ErrorMessage'

class Register extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      emailTaken: false,
      invalidData: false,
      confirm: false,
      dataProcessingAgreement: false
    }
  }
  

  static contextType = Store;

  postUser = async () => {
    try {
      if (this.state.password !== this.state.confirmPassword) {
        throw ErrorMessage('Wrong password');
      }
      const res = await axios({
        method: 'post',
        url: '/api/users',
        data: {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
        },
        headers: setHeaders()
      });

      if (res.status === 200) {
        this.setState({confirm: true});
      } else {
        this.setState({ invalidData: true });
        
      }
    }
    catch (error) {
      this.setState({ invalidData: true });
      console.error('Error Registration:', error);
    }
  }

  checkEmail = async (email) => {
    await axios({
      url: `/api/users/${email}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      if (response.data) return this.setState({ emailTaken: true });
      if (!response.data) return this.setState({ emailTaken: false });
    }, (error) => {
      console.log(error);
    });
  }

  onButtonSubmit = async e => {
    e.preventDefault();
    this.setState({ emailTaken: false })
    await this.checkEmail(this.state.email);
    this.nameValidate(e);
    this.emailValidate(e);
    this.passwordValidate(e);
    if (this.state.emailTaken === false) {
      this.postUser();
    }
  }

  nameValidate = (e) => {
    if (this.state.name.length < 3 && this.state.invalidData) {
      return <ErrorMessage message='Imię powinno być dłuższe niż 3 znaki'/>;
    }
    else { return null }
  }

  emailValidate = (e) => {
    if (this.state.emailTaken === true) {
      return <ErrorMessage message='Email zajęty'/>;
    }
    if (this.state.email.length === 0 && this.state.invalidData) {
      return <ErrorMessage message='Wpisz e-mail'/>;
    }
    else { return null }
  }

  passwordValidate = (e) => {
    if ((this.state.password !== this.state.confirmPassword) && this.state.invalidData) {
      return <ErrorMessage message='Oba hasła powinny być takie same'/>;
    }
    else if ((this.state.password.length < 8 || this.state.confirmPassword.length < 8) && this.state.invalidData) {
      return <ErrorMessage message='Hasło powinno mieć conajmniej 8 znaków'/>;
    }
    else { return null }
  }

  dataProcessingAgreementValidate = (e) => {
    if ((this.state.dataProcessingAgreement === false) && this.state.invalidData) {
      return <ErrorMessage message='Musisz zaakceptować zgodę na przetwarzanie danych'/>;
    }
    else { return null }
  }

  

  render() {
    return (
        <div className="container">
          {this.state.confirm === false ? <div className="registerCard">
            <p>Witamy w programie Forma Zakupy. Jeśli jeszcze nie posiadasz konta - zarejestruj się</p>
            <form>
              <input onChange={e => this.setState({ name: e.target.value.toLowerCase() })}></input>
              {this.nameValidate()}
              <p>Imię</p>
              <input onChange={e => this.setState({ email: e.target.value.toLowerCase() })}></input>
              {this.emailValidate()}
              <p>E-mail</p>
              <input type="password" onChange={e => this.setState({ password: e.target.value })}></input>
              {this.passwordValidate()}
              <p>Hasło</p>
              <input type="password" onChange={e => this.setState({ confirmPassword: e.target.value })}></input>
              <p>Powierdź hasło</p>
              {/* <div className="dataProcessingAgreementContainer">
                <input type="checkbox" id="agree" onClick={() => this.setState({dataProcessingAgreement: !this.state.dataProcessingAgreement})} />
                <label htmlFor="agree">Zapoznałem się z regulaminem</label> 
              </div>
              {this.dataProcessingAgreementValidate()} */}
              <button className="button" onClick={this.onButtonSubmit}>Zarejestruj</button>
            </form>
          </div> : <Confirm name={this.state.name} email={this.state.email}/>}
        </div>
    );
  }
}

export default Register;