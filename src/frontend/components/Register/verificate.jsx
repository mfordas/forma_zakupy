import React from 'react';
import {NavLink} from 'react-router-dom';


class Verification extends React.Component {
    constructor(props) {
        super(props);

        this.state = { verified: '' };
    }

    async componentDidMount() {
        const response = await fetch(`/api/users/verification/${this.props.match.params.token}`)
            .catch(() => this.setState({ verified: false }));


        if (response.status === 200)
            this.setState({ verified: true });
        else 
            this.setState({ verified: false });
    }

    statusComponent() {
        if (this.state.verified === '') {
            return (
                <div>Weryfikacja konta</div>
            );
        }
        else if (this.state.verified === true) {
            return (
                <>
                <div>Konto zweryfikowane</div>
                <div className="containerMenu">
                <NavLink className="buttonMenu" to="/home">Zaloguj się</NavLink>
                </div>
                </>
            );
        }
        else {
            return (
                <div>Błąd weryfikacji, spróbuj ponownie lub skontaktuj się z nami - forma_zakupy@fordas.pl</div>
            );
        }
    }

    render() {
        return (
                this.statusComponent()
        );
    }
};

export default Verification;