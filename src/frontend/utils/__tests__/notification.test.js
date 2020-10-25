import notification from '../notification';

describe('should return a string', () => {

    it('should return a string with shopping list name', () =>{
        const shoppingListFinishedString = notification({name:'Lidl'}, 'shoppinglist');

        expect(shoppingListFinishedString.action).toContain('Lista zakupów Lidl została ukończona');
    });

    it('should return a string with user name', () =>{
        const shoppingListFinishedString = notification({name:'Endrju'});

        expect(shoppingListFinishedString.action).toContain('Użytkownik Endrju dodał Cię do listy zakupów');
    });
})