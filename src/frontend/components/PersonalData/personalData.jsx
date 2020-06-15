import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { deleteAccount } from '../../redux_actions/personalDataActions';
import { myData } from '../../redux_actions/loginActions';
import '../../main_styling/main_styling.scss';

class PersonalDataContent extends React.Component {

    async componentDidMount() {
        await this.props.myData();
    }

    render() {
        const {name, email} = this.props.loginData.me;

        return (
            <>
                {this.props.personalData.accountDeleted === false ? <div className="container-personaldata">
                        <div className="container-data">Dane, które przechowujemy:</div>
                        <div className="container-data">Imię: {name}</div>
                        <div className="container-data">E-mail: {email}</div>
                        <div className="container-data">W każdej chwili możesz usunąć swoje dane - wiąże się to ze skasowaniem konta w naszej aplikacji. Usunięcie konta
                        spowoduje usunięcie wszystkich list zakupów oraz własnych produktów.</div>
                        <button className="button" style={{ backgroundColor: 'red', color:'white' }} onClick={() => this.props.deleteAccount()}>Usuń konto</button>
                        <NavLink className="button" to="/shoppingLists">Strona główna</NavLink>
                    </div> : <Redirect to="/confirmDeleteAccount"/> }
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    loginData: state.loginData,
    personalData: state.personalData,
  });
  
  PersonalDataContent.propTypes = {
    loginData: PropTypes.object,
    personalData: PropTypes.object
  }

  export default connect(mapStateToProps, { deleteAccount, myData })(PersonalDataContent);