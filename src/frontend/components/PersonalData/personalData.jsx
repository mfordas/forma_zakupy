import React from 'react';
import axios from 'axios';
import setHeaders from '../../utils/setHeaders';
import Store from '../../../Store';
import ConfirmDeleteAccount from './confirmDeleteAccount';
import '../../main_styling/main_styling.scss';


class PersonalDataContent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            email: '',
            accountDeleted: false
        }
    }

    showPersonalData = async () => {
        let personalData = await axios({
            url: `/api/users/me`,
            method: "GET",
            headers: setHeaders()
        });
        console.log(personalData);
        this.setState({
            name: personalData.data.name,
            email: personalData.data.email
        });
    }

    deleteAccount = async () => {
        try {
            const id = localStorage.getItem('id');
            const res = await axios({
                url: `/api/users/${id}`,
                method: "DELETE",
                headers: setHeaders()
            });

            if (res.status === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('id');
                Store.changeStore('isLogged', false);
                Store.changeStore('hasCharacter', null);
                this.setState({ accountDeleted: true })
            }

        } catch (error) {
            console.log(error)
        }

    }

    componentDidMount() {
        this.showPersonalData();
    }

    render() {
        const { name, email } = this.state;

        return (
            <>
                {this.state.accountDeleted === false ? <div className="container-personaldata">
                    <div>Dane, które przechowujemy:</div>
                    <div className="container-personaldata">
                        <div className="container-data">Imię: {name}</div>
                        <div className="container-data">E-mail: {email}</div>
                        <div className="container-data">W każdej chwili możesz usunąć swoje dane - wiąże się to ze skasowaniem konta w najszej aplikacji.</div>
                        <button className="button" style={{ backgroundColor: 'red' }} onClick={this.deleteAccount}>Usuń konto</button>
                    </div></div> : <ConfirmDeleteAccount />}
            </>
        );
    }
}

export default PersonalDataContent;







