import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { TiArrowBack } from 'react-icons/ti';

import { getUserInfo, deleteUserAccount, saveUserChanges } from '../../redux_actions/adminPanelActions';
import '../../main_styling/main_styling.scss';

class UserInfo extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isAdmin: this.props.adminPanelData.userInfo.isAdmin,
            isVerified: this.props.adminPanelData.userInfo.isVerified
        }
    }

    setValueOfSelectElement(id, value) {
        let element = document.getElementById(id);
        element.value = value;
    }

    componentDidMount() {
        this.setValueOfSelectElement('isAdmin', this.props.adminPanelData.userInfo.isAdmin);
        this.setValueOfSelectElement('isVerified', this.props.adminPanelData.userInfo.isVerified);
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.adminPanelData.userInfo) !== JSON.stringify(prevProps.adminPanelData.userInfo)) {
            this.setState({
                isAdmin: this.props.adminPanelData.userInfo.isAdmin,
                isVerified: this.props.adminPanelData.userInfo.isVerified
            });

            this.setValueOfSelectElement('isAdmin', this.props.adminPanelData.userInfo.isAdmin);
            this.setValueOfSelectElement('isVerified', this.props.adminPanelData.userInfo.isVerified);
        }
    }

    render() {
        const { userInfo } = this.props.adminPanelData;

        return (
            <div className="container-usersList">
                <div className="header-usersList">
                    <div className="header">{userInfo.name}</div>
                    <button className="button" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => this.props.deleteUserAccount(userInfo._id)}>Usuń</button>

                    <Link className="button" to={`/adminPanel`}><TiArrowBack /></Link>
                </div>
                <div key={userInfo._id} className="userCard">
                    <div className="userOption">
                        <div className="userOptionContent">e-mail: </div>
                        <div className="userOptionContent">{userInfo.email}</div>
                    </div>
                    <div className="userOption">
                        <div className="userOptionContent">isAdmin: </div>
                        <select id='isAdmin' className="button" onChange={e => this.setState({ isAdmin: e.target.value })}>
                            <option value='false'>false</option>
                            <option value='true'>true</option>
                        </select>
                    </div>
                    <div className="userOption">
                        <div className="userOptionContent">isVerified: </div>
                        <select id='isVerified' className="button" onChange={e => this.setState({ isVerified: e.target.value })}>
                            <option value='false'>false</option>
                            <option value='true'>true</option>
                        </select>
                    </div>
                </div>
                <button className="button" style={{ backgroundColor: 'green', color: 'white' }} onClick={() => this.props.saveUserChanges(userInfo._id, this.state)}>Zapisz</button>
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

export default connect(mapStateToProps, { deleteUserAccount, getUserInfo, saveUserChanges })(UserInfo);