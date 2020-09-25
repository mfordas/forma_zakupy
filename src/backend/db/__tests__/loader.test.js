import load from '../loader';
import connect from '../connection';

describe('Testing loading', () => {
    it('Should load compiled models and extensions', async () => {
        const referenceModelsAndExtensions = {
                user: { },
                shoppingList: { },
                product:{ },
                externalUser: { },
                notification:{ }
        }
        const connection = await connect();

        const loadedModelsAndExtensions = load(connection);

        expect(loadedModelsAndExtensions).toMatchObject(referenceModelsAndExtensions);

        connection.close();
        
     });

    

});