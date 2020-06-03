import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import axios from 'axios';
import setHeaders from '../../utils/setHeaders';
import Store from '../../../Store';
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

    static contextType = Store;

    showPersonalData = async () => {
        let personalData = await axios({
            url: `/api/users/me`,
            method: "GET",
            headers: setHeaders()
        });
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
                this.setState({ accountDeleted: true })
                this.context.changeStore('isLogged', false);
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
                        <div className="container-data">Dane, które przechowujemy:</div>
                        <div className="container-data">Imię: {name}</div>
                        <div className="container-data">E-mail: {email}</div>
                        <div className="container-data">W każdej chwili możesz usunąć swoje dane - wiąże się to ze skasowaniem konta w naszej aplikacji. Usunięcie konta
                        spowoduje usunięcie wszystkich list zakupów oraz własnych produktów.</div>
                        <button className="button" style={{ backgroundColor: 'red' }} onClick={this.deleteAccount}>Usuń konto</button>
                        <NavLink className="button" to="/shoppingLists">Strona główna</NavLink>
                    </div> : <Redirect to="/confirmDeleteAccount" />}
            </>
        );
    }
}

export default PersonalDataContent;







