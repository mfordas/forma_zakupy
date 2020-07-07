import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getUsersList, deleteUserAccount } from '../../redux_actions/adminPanelActions';
import '../../main_styling/main_styling.scss';

class UsersList extends React.Component {

    async componentDidMount() {
        await this.props.getUsersList();
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.loginData.me) !== JSON.stringify(prevProps.loginData.me) || JSON.stringify(this.props.adminPanelData) !== JSON.stringify(prevProps.adminPanelData)) {
            this.props.getUsersList();
            this.createUserList();
        }
    };

    createUserList = () => {
        const { usersList } = this.props.adminPanelData;

        return usersList.map(user =>
            <div key={user._id} className="user">
                <div className="header-data">{user.name}</div>
                <div className="header-data">{user.email}</div>
                <button className="button" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => this.props.deleteUserAccount(user._id)}>X</button>
            </div>)
    }

    render() {
        return (
            <div className="container-usersList">
                <div className="header-usersList">
                    <div className="header">Użytkownicy</div>
                </div>
                { this.createUserList() }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    adminPanelData: state.adminPanelData,
    loginData: state.loginData,
});

UsersList.propTypes = {
    adminPanelData: PropTypes.object,
    loginData: PropTypes.object,
}

export default connect(mapStateToProps, { deleteUserAccount, getUsersList })(UsersList);