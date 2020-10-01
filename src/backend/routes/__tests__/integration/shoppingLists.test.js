import * as request from 'supertest';
import jwt from "jsonwebtoken";
import * as application from '../../../app';

let api;
let server;
let dbCon;
let ShoppingList;
let User;

const token = jwt.sign({},
    process.env.JWTPRIVATEKEY
);

beforeAll(async () => {
    dbCon = await application.dbConnection();
    server = application.main();
    api = request.agent(server);
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
})

afterAll(() => {
    dbCon.close();
    server.close();
})

describe('/api/shoppingLists', () => {
    describe('GET /', () => {
        it('should return all shoppingLists', async () => {
            User = application.models.user;

            const user = new User({
                name: "Jan",
                email: 'adminEmail@Mail.com',
                password: '12345679',
                shopping_lists_id: [],
                common_shopping_lists_id: [],
                custom_products: [],
                isAdmin: true,
                isVerified: true
            });

            await user.save();

            const adminToken = await user.generateAuthToken();

            const res = await api.get('/api/shoppingLists')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', adminToken)
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
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
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
                .set('x-auth-token', token)
                .send(shoppingList);

            expect(res.status).toBe(400);
        });

    });

    describe('POST /:id/shoppingList', () => {

        it('should save valid shoppinglist in database and user shoppinglists', async () => {
            const shoppingList = {
                "name": "Tesco"
            };

            User = application.models.user;
            const user = new User({
                name: "Mat",
                email: "mail@mail.com",
                password: "12345678"
            });

            await user.save();

            const res = await api.post(`/api/shoppingLists/${user._id}/shoppingList`)
                .set('Accept', 'application/json')
                .set('x-auth-token', token)
                .send(shoppingList);

            expect(res.status).toBe(200);
            expect(res.body.shopping_lists_id.length).toBe(1);
        });

        it('should send 404 if invalid id is passed', async () => {
            const shoppingList = {
                "name": "Makro"
            };

            const res = await api.post(`/api/shoppingLists/000000000000/shoppingList`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
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

            await user.save();

            const res = await api.post(`/api/shoppingLists/${user._id}/shoppingList`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(shoppingList);

            expect(res.status).toBe(400);
        });
    });

    describe('GET /:id/shoppingLists', () => {

        it('should return all shopping lists for user', async () => {
            ShoppingList = application.models.shoppingList;

            const shoppingLists = await ShoppingList.find();
            const shoppingListsIds = await shoppingLists.map(shoppinglist => shoppinglist._id);

            User = application.models.user;

            const user = new User({
                name: "Jan",
                email: 'adminEmail@Mail.com',
                password: '12345679',
                shopping_lists_id: shoppingListsIds,
                common_shopping_lists_id: [],
                custom_products: [],
                isAdmin: true,
                isVerified: true
            });

            await user.save();

            const res = await api.get(`/api/shoppingLists/${user._id}/shoppingLists`)
                .set('Accept', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(shoppingLists.length);
        });

        it('should send 404 if invalid user id is passed', async () => {
            User = application.models.user;

            const user = new User({
                name: "Jan",
                email: 'adminEmail@Mail.com',
                password: '12345679',
                shopping_lists_id: [],
                common_shopping_lists_id: [],
                custom_products: [],
                isAdmin: true,
                isVerified: true
            });

            await user.save();

            const res = await api.get(`/api/shoppingLists/000000000000/shoppingLists`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono użytkowanika z takim ID.");
        });

    });

    describe('GET /:id', () => {

        it('should return shopping list with given id', async () => {
            ShoppingList = application.models.shoppingList;

            const shoppingLists = await ShoppingList.find();
            const shoppingListId = shoppingLists[0]._id;

            const res = await api.get(`/api/shoppingLists/${shoppingListId}`)
                .set('Accept', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("products");
            expect(res.body).toHaveProperty("members_id");
            expect(res.body).toHaveProperty("completed");
            expect(res.body).toHaveProperty("_id", `${shoppingListId}`);
        });

        it('should send 404 if invalid shopping list id is passed', async () => {

            const res = await api.get(`/api/shoppingLists/000000000000`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono listy zakupów z takim ID.");
        });

    });

    describe('PUT /:id/product', () => {

        it('should add product to shopping list of given id', async () => {
            ShoppingList = application.models.shoppingList;

            const shoppingLists = await ShoppingList.find();

            const shoppingListId = shoppingLists[5]._id;

            const product = {
                name: "Pomidor",
                amount: 10,
                unit: "kg",
            }

            const res = await api.put(`/api/shoppingLists/${shoppingListId}/product`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(200);
            expect(res.body.products[0]).toHaveProperty("name", "Pomidor");
            expect(res.body.products[0]).toHaveProperty("amount", 10);
            expect(res.body.products[0]).toHaveProperty("unit", "kg");
            expect(res.body.products[0]).toHaveProperty("bought", false);
            expect(res.body.products[0]).toHaveProperty("_id");
        });

        it('should send 404 if invalid shopping list id is passed', async () => {
            const product = {
                name: "Pomidor",
                amount: 10,
                unit: "kg",
            }

            const res = await api.put(`/api/shoppingLists/000000000000/product`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product)

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono listy zakupów z takim ID.");
        });

        it('should should send 400 if product data is not complete - missing name', async () => {
            ShoppingList = application.models.shoppingList;

            const shoppingLists = await ShoppingList.find();

            const shoppingListId = shoppingLists[5]._id;

            const product = {
                amount: 10,
                unit: "kg",
            }

            const res = await api.put(`/api/shoppingLists/${shoppingListId}/product`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(400);
            expect(res.text).toContain('"name" is required');
        });

        it('should should send 400 if product data is not complete - missing amount', async () => {
            ShoppingList = application.models.shoppingList;

            const shoppingLists = await ShoppingList.find();

            const shoppingListId = shoppingLists[5]._id;

            const product = {
                name: "Pomidor",
                unit: "kg",
            }

            const res = await api.put(`/api/shoppingLists/${shoppingListId}/product`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(400);
            expect(res.text).toContain('"amount" is required');
        });

        it('should should send 400 if product data is not complete - missing unit', async () => {
            ShoppingList = application.models.shoppingList;

            const shoppingLists = await ShoppingList.find();

            const shoppingListId = shoppingLists[5]._id;

            const product = {
                name: "Pomidor",
                amount: 10,
            }

            const res = await api.put(`/api/shoppingLists/${shoppingListId}/product`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(400);
            expect(res.text).toContain('"unit" is required');
        });

    });

});