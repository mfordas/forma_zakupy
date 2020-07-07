import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getUserInfo, deleteUserAccount } from '../../redux_actions/adminPanelActions';
import '../../main_styling/main_styling.scss';

class UserInfo extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    async componentDidMount() {
        console.log('works');
        await this.props.getUserInfo(this.props.id);
    }
   

    render() {
        const { userInfo } = this.props.adminPanelData;


        return (
            <div className="container-usersList">
                <div className="header-usersList">
                    <div className="header">{userInfo.name}</div>
                </div>
                <div key={userInfo._id} className="userCard">
                <div className="header-data">{userInfo.name}</div>
                <div className="header-data">{userInfo.email}</div>
                <button className="button" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => this.props.deleteUserAccount(userInfo._id)}>X</button>
            </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    adminPanelData: state.adminPanelData,
});

UserInfo.propTypes = {
    adminPanelData: PropTypes.object,
}

export default connect(mapStateToProps, { deleteUserAccount, getUserInfo })(UserInfo);