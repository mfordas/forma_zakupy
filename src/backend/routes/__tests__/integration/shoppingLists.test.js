import * as request from 'supertest';
import * as application from '../../../app';

let api;
let server;
let ShoppingList;
let User;

beforeEach(async () => {
    server = await application.main();
    api = request.agent(server);

});
afterEach(async () => {
    await server.close();
});

afterAll(async () => {
    await server.close();
})

describe('/api/shoppingLists', () => {
    describe('GET /', () => {
        it('should return all shoppingLists', async () => {
            const newShoppingLists = [{
                    name: "Lidl"
                },
                {
                    name: "Castorama"
                },
                {
                    name: "Biedronka"
                }
            ];

            ShoppingList = application.models.shoppingList;

            const collectionShoppingList = ShoppingList.collection;
            await collectionShoppingList.insertMany(newShoppingLists);

            const res = await api.get('/api/shoppingLists')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', process.env.JWTPRIVATEKEY);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
        });
    });

    describe('POST /', () => {
        it('should save valid shoppinglist in database', async () => {
            const shoppingList = {
                "name": "Lidl"
            };

            const res = await api.post('/api/shoppingLists')
                .set('Accept', 'application/json')
                .set('x-auth-token', process.env.JWTPRIVATEKEY)
                .send(shoppingList);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "Lidl");
            expect(res.body).toHaveProperty("products", []);
            expect(res.body).toHaveProperty("members_id", []);
            expect(res.body).toHaveProperty("completed", false);
        });


        it('should send 400 if shoppinglist is not valid - missing all required values', async () => {
            const shoppingList = {};

            const res = await api.post('/api/shoppingLists')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', process.env.JWTPRIVATEKEY)
                .send(shoppingList);

            expect(res.status).toBe(400);
        });

    });

    describe('POST /:id/shoppingList', () => {

        it('should save valid shoppinglist in database and user shoppinglists', async () => {
            const shoppingList = {
                "name": "Lidl"
            };

            User = application.models.user;
            const user = new User({
                name: "Mat",
                email: "mail@mail.com",
                password: "12345678"
            });

            user.save();

            const res = await api.post(`/api/shoppingLists/${user._id}/shoppingList`)
                .set('Accept', 'application/json')
                .set('x-auth-token', process.env.JWTPRIVATEKEY)
                .send(shoppingList);

            expect(res.status).toBe(200);
            expect(res.body.shopping_lists_id.length).toBe(1);
        });

        it('should send 404 if invalid id is passed', async () => {
            const shoppingList = {
                "name": "Lidl"
            };

            const res = await api.post(`/api/shoppingLists/000000000000/shoppingList`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', process.env.JWTPRIVATEKEY)
                .send(shoppingList);

            expect(res.status).toBe(404);
        });

        it('should send 400 if invalid shoppinglist is passed', async () => {
            const shoppingList = {

            };

            User = application.models.user;
            const user = new User({
                name: "Mat",
                email: "mail@mail.com",
                password: "12345678"
            });

            user.save();

            const res = await api.post(`/api/shoppingLists/${user._id}/shoppingList`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', process.env.JWTPRIVATEKEY)
                .send(shoppingList);

            expect(res.status).toBe(400);
        });
    })



});