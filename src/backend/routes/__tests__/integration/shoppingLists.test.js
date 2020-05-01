import * as request from 'supertest';
import * as application from '../../../app';

let api;
let server;
let ShoppingList;

beforeEach(async () => {
    server = await application.main();
    api = request.agent(server);
    ShoppingList = application.models.shoppingList;
});
afterEach(async () => {
    await server.close();
});

describe('/api/shoppingLists', () => {
    describe('GET /', () => {
        it('should return all shoppingLists', async () => {
            const newShoppingList = {
                name: "Lidl"
            };

            const collectionDB = ShoppingList.collection;
            await collectionDB.insertOne(newShoppingList);
                     
            const res = await api.get('/api/shoppingLists');
            console.log(res.body);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });
    });

    describe('POST /', () => {
        it('should save valid shoppinglist in database', async () => {
            const shoppingList = {
                "name": "Lidl"
            };

            const res = await api.post('/api/shoppingLists')
                .send(shoppingList);

                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("name", "Lidl");
                expect(res.body).toHaveProperty("products", []);
                expect(res.body).toHaveProperty("members_id", []);
                expect(res.body).toHaveProperty("completed", false);
        });

        
        it('should send 400 if shoppinglist is not valid - missing all required values', async () => {
            const shoppingList = {
            };

            const res = await api.post('/api/shoppingLists')
                .send(shoppingList);

                expect(res.status).toBe(400);
        });
    })

    

});