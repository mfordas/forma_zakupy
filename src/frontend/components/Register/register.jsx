import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import '../../main_styling/main_styling.scss';
import Confirm from './confirm';
import ErrorMessage from '../ReusableComponents/ErrorMessage';
import { postUser, checkEmail } from '../../redux_actions/registerActions';

class Register extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      dataProcessingAgreement: false
    }
  }

  onButtonSubmit = async e => {
    e.preventDefault();
    await this.props.checkEmail(this.state.email);
    this.nameValidate();
    this.emailValidate();
    this.passwordValidate();
    if (this.props.registerData.emailTaken === false) {
      await this.props.postUser(this.state);
    }
  }

  nameValidate = () => {
    if (this.state.name.length < 3 && this.props.registerData.invalidData) {
      return <ErrorMessage message='Imię powinno być dłuższe niż 3 znaki'/>;
    }
    else { return null }
  }

  emailValidate = () => {
    if (this.props.registerData.emailTaken === true) {
      return <ErrorMessage message='Email zajęty'/>;
    }
    if (this.state.email.length === 0 && this.props.registerData.invalidData) {
      return <ErrorMessage message='Wpisz e-mail'/>;
    }
    else { return null }
  }

  passwordValidate = () => {
    if ((this.state.password !== this.state.confirmPassword) && this.props.registerData.invalidData) {
      return <ErrorMessage message='Oba hasła powinny być takie same'/>;
    }
    else if ((this.state.password.length < 8 || this.state.confirmPassword.length < 8) && this.props.registerData.invalidData) {
      return <ErrorMessage message='Hasło powinno mieć conajmniej 8 znaków'/>;
    }
    else { return null }
  }

  dataProcessingAgreementValidate = () => {
    if ((this.state.dataProcessingAgreement === false) && this.props.registerData.invalidData) {
      return <ErrorMessage message='Musisz zaakceptować zgodę na przetwarzanie danych'/>;
    }
    else { return null }
  }

  

  render() {
    return (
        <div className="container">
          {this.props.registerData.confirm === false ? <div className="registerCard">
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


const mapStateToProps = (state) => ({
  registerData: state.registerData,
});

Register.propTypes = {
  registerData: PropTypes.object
}

export default connect(mapStateToProps, { postUser, checkEmail })(Register);