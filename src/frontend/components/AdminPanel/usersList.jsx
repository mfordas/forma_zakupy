import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteAccount } from '../../redux_actions/personalDataActions';
import '../../main_styling/main_styling.scss';

class UsersList extends React.Component {

    async componentDidMount() {
    }

    render() {
        return (
            <div className="container-usersList">
                <div className="header-usersList">
                    <div className="header">Użytkownicy</div>
                </div>
                <div className="user">
                    <div className="header-data">Jan</div>
                    <div className="header-data">jan@email.com</div>
                    <button className="button" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => console.log('deleted')}>X</button>
                </div>
                <div className="user">
                    <div className="header-data">Andrzej</div>
                    <div className="header-data">andrzej@email.com</div>
                    <button className="button" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => console.log('deleted')}>X</button>
                </div>
                <div className="user">
                    <div className="header-data">Ewa</div>
                    <div className="header-data">ewa@email.com</div>
                    <button className="button" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => console.log('deleted')}>X</button>
                </div>
                
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    loginData: state.loginData,
    personalData: state.personalData,
});

UsersList.propTypes = {
    loginData: PropTypes.object,
    personalData: PropTypes.object
}

export default connect(mapStateToProps, { deleteAccount })(UsersList);