export default (actionCreator) => {
    switch (actionCreator) {
        case actionCreator.products === true:
            return {
                actionCreator: actionCreator.name,
                action: `Lista zakupów ${actionCreator.name} została ukończona`,
            };
            default:
                return {
                    actionCreator: actionCreator.name,
                    action: `Użytkownik ${actionCreator.name} dodał Cię do listy zakupów`,
                };
    }
}